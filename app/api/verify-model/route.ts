import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { createLogger } from '@/lib/logger';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { resolveModel } from '@/lib/server/resolve-model';
import { resolveApiKey } from '@/lib/server/provider-config';
export const maxDuration = 60;
const log = createLogger('Verify Model');

export async function POST(req: NextRequest) {
  try {
    const { apiKey, baseUrl, model, providerType, requiresApiKey, testMode } = await req.json();

    if (!model) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'Model name is required');
    }

    // Key validation is intentionally separate from inference.
    if (typeof model === 'string' && model.startsWith('nvidia:') && testMode === 'credentials') {
      const official = 'https://integrate.api.nvidia.com/v1';
      if (baseUrl && baseUrl.replace(/\/+$/, '') !== official) {
        return apiError('INVALID_REQUEST', 400, 'NVIDIA credential check requires the official hosted Base URL.');
      }
      const key = typeof apiKey === 'string' ? apiKey.trim() : '';
      const effectiveKey = key || resolveApiKey('nvidia');
      if (!effectiveKey) return apiError('MISSING_API_KEY', 400, 'Enter an NVIDIA API key.');
      try {
        const response = await fetch(official + '/models', {
          headers: { Authorization: 'Bearer ' + effectiveKey },
          cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) return apiError('UPSTREAM_ERROR', response.status === 401 || response.status === 403 ? response.status : 502, 'NVIDIA model catalogue returned HTTP ' + response.status + '. Check account access or retry.');
        const catalogue = await response.json();
        if (!Array.isArray(catalogue.data)) return apiError('UPSTREAM_ERROR', 502, 'Unexpected NVIDIA model catalogue response.');
        const selected = model.slice('nvidia:'.length);
        return apiSuccess({ message: 'NVIDIA accepted the API key and returned its model catalogue. Inference has not been tested.', modelListed: catalogue.data.some((entry: {id?:string}) => entry.id === selected) });
      } catch {
        return apiError('UPSTREAM_ERROR', 504, 'NVIDIA catalogue check did not respond. This does not establish that the key is invalid.');
      }
    }

    // Parse model string and resolve server-side fallback
    let languageModel;
    try {
      const result = resolveModel({
        modelString: model,
        apiKey: apiKey || '',
        baseUrl: baseUrl || undefined,
        providerType,
        requiresApiKey,
      });
      languageModel = result.model;
    } catch (error) {
      return apiError(
        'INVALID_REQUEST',
        401,
        error instanceof Error ? error.message : String(error),
      );
    }

    // Send a minimal test message
    const { text } = await generateText({
      model: languageModel,
      prompt: 'Reply with OK only.',
      maxOutputTokens: 256,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(typeof model === 'string' && model.startsWith('nvidia:') ? 50000 : 25000),
    });

    return apiSuccess({
      message: 'Connection successful',
      response: text,
    });
  } catch (error) {
    log.error('API test error:', error);

    let errorMessage = 'Connection failed';
    if (error instanceof Error) {
      // Parse common error messages
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'API key is invalid or expired';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = 'Provider denied access. Check your API key permissions, model availability and quota.';
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        errorMessage = 'Model not found or API endpoint error';
      } else if (error.message.includes('429')) {
        errorMessage = 'API rate limit exceeded, please try again later';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to API server, please check the Base URL';
      } else if (/timeout|timed out|abort/i.test(error.message + ' ' + error.name)) {
        errorMessage = 'Model inference timed out. For NVIDIA, check the API key separately and try another listed model.';
      } else {
        errorMessage = error.message;
      }
    }

    return apiError('INTERNAL_ERROR', 500, errorMessage);
  }
}
