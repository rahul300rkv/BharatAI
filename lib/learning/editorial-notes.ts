// Original educational draft expansions; human editorial review remains required.
export const labNotes:Record<string,string[]>={
  "ohms-law": [
    "At constant temperature an ideal ohmic resistor has a fixed ratio of potential difference to current. The slope of a current-versus-voltage graph is the reciprocal of resistance. Electrical power measures energy transferred per second and can also be calculated as V²/R.",
    "At 6 Ω, compare 6, 12 and 18 V: the expected currents are 1, 2 and 3 A. Next keep 12 V constant and compare 3, 6 and 12 Ω: currents become 4, 2 and 1 A. Record power for each setting and check the two different proportional relationships.",
    "Doubling voltage at fixed resistance quadruples power, whereas doubling resistance at fixed voltage halves power. Real resistors can heat up, and batteries have internal resistance. Semiconductor devices need not follow a linear current-voltage relationship. This model uses an ideal source and is not a guide to real electrical wiring."
  ],
  "projectile-motion": [
    "Resolve the initial velocity into horizontal and vertical components. Horizontal velocity remains constant without drag, while vertical velocity changes by gravitational acceleration. At maximum height vertical velocity vanishes but horizontal velocity need not vanish. The range formula assumes launch and landing at the same height.",
    "At 20 m/s compare 30°, 45° and 60°. The complementary angles give equal ranges, but the higher angle produces a longer flight and higher peak. At a fixed angle double the speed: range and height become four times larger and time doubles. Compare numerical outputs, because the plotted axes can rescale.",
    "Gravity acts downward even at the highest point. Do not mistake velocity direction for acceleration direction. Air resistance, wind and different landing elevations change the predictions. The simulation isolates an ideal uniform gravitational field; its range is not a universal prediction for real moving objects."
  ],
  "quadratic-equations": [
    "A parabola opens upward when its leading coefficient is positive and downward when negative. Its symmetry axis lies at x = −b/(2a). The constant coefficient is the vertical intercept. The discriminant determines whether the graph crosses, touches or misses the horizontal axis.",
    "Set a = 1 and b = 0, then vary c between −4, zero and 4. The first case gives roots −2 and 2, the second gives a repeated root at zero, and the third gives no real roots. Check each displayed root by substitution into the equation. Change the sign of a and predict the opening direction.",
    "A negative discriminant does not exclude complex roots, which are outside this real-number simulation. The quadratic formula requires a nonzero leading coefficient. Roots beyond the visible graph may be clipped, so rely on the calculated values as well as the plotted curve."
  ],
  "series-parallel-circuits": [
    "Series resistors share one current; their voltage drops sum to the supply voltage. Parallel branches share voltage, and their currents sum to the total. Equivalent resistance describes a single resistor that draws the same total current from the source. Adding a parallel branch decreases equivalent resistance.",
    "Use a 12 V source and two 6 Ω resistors. Series resistance is 12 Ω and current is 1 A. Parallel resistance is 3 Ω and current is 4 A. Change the second resistor to 12 Ω and predict the series and parallel resistances before switching the connection. They should be 18 Ω and 4 Ω.",
    "The larger series resistor has the larger voltage drop; the larger parallel resistor draws less branch current. Do not add parallel resistances directly. Ideal wires and a fixed source are assumed, so heating, battery limits and contact resistance are excluded."
  ],
  "logic-gates": [
    "Logic gates map binary inputs to a binary output. AND requires both inputs, OR accepts either or both, XOR requires different inputs, and NOT reverses one input. NAND, NOR and XNOR complement their corresponding basic gates. Truth tables enumerate every possible input combination.",
    "Select AND and test 00, 01, 10 and 11. Repeat with OR and XOR and notice that they differ only for 11. Check NAND against the complement of AND for every row. For NOT change A alone. Write the output sequence before looking at the displayed truth table.",
    "Boolean OR is not arithmetic addition: 1 OR 1 gives 1, while binary addition produces 10. The model ignores propagation delay, voltage thresholds and electrical noise. A truth table describes logical behaviour but does not specify the transistor circuit implementing the gate."
  ],
  "binary-converter": [
    "Each position in a number system carries a weight that is a power of its base. An unsigned eight-bit binary integer spans zero through 255. Octal groups binary positions in threes, while hexadecimal groups them in fours. Leading zeroes do not change the numerical value.",
    "Enter 15 and then 16: four low bits turn off and the next bit turns on. Toggle the bit worth 128 and compare the new decimal value. Convert 31 into hexadecimal by grouping binary digits from the right and verify the result by multiplying each hexadecimal digit by its positional weight.",
    "Hexadecimal A through F stand for decimal ten through fifteen. The simulator represents unsigned integers only; signed two's complement, fractional values and overflow require additional conventions. Verify any conversion by summing the weights of the set bits rather than reading a binary string as decimal."
  ],
  "simple-pendulum": [
    "A simple pendulum models a point mass on a light inextensible string. At small angular displacements its period depends on length and gravitational acceleration, not mass. A period is a complete oscillation ending at the same position and direction of motion.",
    "Compare lengths in a four-to-one ratio within the slider range. The longer pendulum has twice the period, not four times the period. At fixed length reduce gravity and observe the increase in period. Calculate the expected ratio with square roots before moving the controls, and compare frequency as the reciprocal of period.",
    "Large amplitudes invalidate the small-angle approximation. Air resistance and pivot friction dissipate energy in actual pendulums. A movement from one extreme to the other is half a period. The model isolates length and gravity rather than describing the complete dynamics of a laboratory pendulum."
  ],
  "convex-lens": [
    "A converging lens bends paraxial rays toward its principal focus. This model uses positive object distance and positive real image distance; a negative image distance denotes a virtual image. The signed magnification describes orientation as well as size.",
    "For focal length 10 cm, try object distances of 30, 20 and 15 cm. Expected image distances are 15, 20 and 30 cm. At 5 cm the virtual image distance is −10 cm with magnification +2. Compare the sign of magnification and the relative size in each case.",
    "At the focal distance outgoing rays are parallel and there is no finite image distance in the ideal model. A virtual image cannot be projected directly onto a screen. Real lenses have thickness and optical aberrations. Keep the sign convention consistent when comparing textbook formulas."
  ],
  "hookes-law": [
    "Hooke's law relates force magnitude to extension in the linear elastic region. The signed restoring force points opposite to displacement. Stiffness is measured in newtons per metre, and stored elastic energy is the area under the force-extension graph.",
    "Set stiffness to 100 N/m and extension to 0.1 m. Force is 10 N and stored energy is 0.5 J. Double extension: force becomes 20 N and energy 2 J. Restore extension and double stiffness to compare its effect on both readings. Explain the difference between linear and quadratic scaling.",
    "Convert centimetres to metres before calculation and distinguish extension from total length. Beyond the elastic limit a real spring may deform permanently. The simulator neglects mass, damping and oscillation. The factor one half in the energy equation reflects the changing force during stretching."
  ],
  "wave-motion": [
    "Wavelength is the distance between successive equivalent phase points, while frequency counts cycles per second. A sinusoidal travelling wave has speed equal to frequency times wavelength. Amplitude measures maximum displacement and is absent from that speed equation.",
    "Set wavelength to 2 m and frequency to 5 Hz. The speed is 10 m/s. At fixed wavelength increase frequency and compare speed; then hold frequency fixed and reduce wavelength. Vary amplitude separately and note that the calculated speed is unchanged. Record the readings in separate columns.",
    "In a real nondispersive medium the speed is normally determined by the medium, so changing source frequency changes wavelength. This simulator intentionally varies independent parameters to illustrate their mathematical relation. A crest propagates along the wave while a medium particle may simply oscillate around equilibrium."
  ],
  "buoyancy": [
    "Archimedes' principle states that buoyant force equals the weight of displaced fluid. A fully submerged body displaces its entire volume. A freely floating body displaces only enough fluid to balance its weight. For a homogeneous floating object the submerged fraction equals the ratio of object density to fluid density.",
    "Compare an object of density 600 kg/m³ in water of density 1000 kg/m³. It floats with 60 percent of its volume submerged. For one litre its weight is about 5.88 N and the maximum buoyant force is 9.8 N. Increase object density to match and then exceed fluid density.",
    "Maximum buoyancy at full immersion differs from actual buoyancy on a floating object. At equilibrium the upward buoyant force equals weight. Use consistent volume units: one litre is 0.001 cubic metres. The ideal calculation ignores surface tension, compression, motion of fluid and trapped air."
  ],
  "ph-scale": [
    "The pH scale expresses hydrogen ion activity logarithmically. For introductory dilute aqueous solutions, activity is approximated by concentration. At 25 °C the sum of pH and pOH is approximately fourteen, and neutral pure water has pH near seven.",
    "Compare pH values 3, 4 and 5. Their approximate hydrogen ion concentrations are 10⁻³, 10⁻⁴ and 10⁻⁵ mol/L. Compare pH 2 with pH 6: the concentrations differ by a factor of ten thousand. Calculate pOH for an alkaline solution at pH 9 before checking the model.",
    "One pH unit is a tenfold concentration ratio, not a linear increment. Neutral pH changes with temperature, and concentrated solutions need activity corrections. Mixing solutions cannot generally be predicted by averaging their pH. This mathematical model is not a chemical handling or preparation guide."
  ],
  "balancing-chemical-equations": [
    "A chemical equation conserves the number of atoms of each element. Coefficients multiply entire formulas and give ratios of particles or moles. Subscripts identify chemical substances and must remain unchanged. The example represents formation of water from hydrogen and oxygen.",
    "Start with H₂ + O₂ → H₂O. Place two before water to balance oxygen; this creates four hydrogen atoms on the right. Place two before hydrogen to match them. Verify the counts on each side. Double every coefficient and notice the balance remains, but the ratio is no longer the smallest integer ratio.",
    "Balancing describes stoichiometric conservation, not the reaction mechanism or proof that a reaction occurs spontaneously. Changing water to hydrogen peroxide changes the substance and is not legitimate balancing. This symbolic exercise provides no instructions for carrying out reactions or mixing gases."
  ],
  "molarity": [
    "Molarity is the amount of dissolved solute in moles per litre of final solution, not per litre of solvent. For a fixed dissolved amount, increasing solution volume reduces concentration. Multiplying concentration by final volume gives the amount of solute.",
    "Compare 0.5 mol in 2 L, 0.5 mol in 1 L and 1 mol in 2 L. The concentrations are 0.25, 0.5 and 0.5 mol/L. In a dilution calculation, 0.25 L at 2 mol/L contains 0.5 mol. If final volume becomes 1 L without loss of solute, concentration becomes 0.5 mol/L.",
    "Molality uses mass of solvent rather than volume of solution, and mass concentration requires molar mass for conversion. The model assumes positive final volume and known dissolved amount. It does not account for precipitation, reaction, temperature changes or practical solution preparation."
  ],
  "ideal-gas-law": [
    "The ideal gas equation relates absolute pressure, volume, amount and thermodynamic temperature. The constant 8.314 L·kPa/(mol·K) matches litres and kilopascals. Pressure varies directly with absolute temperature at fixed amount and volume, and inversely with volume at fixed temperature.",
    "For one mole at 300 K in 24 L, pressure is about 103.9 kPa. Compare 12 L at the same temperature to obtain about 207.9 kPa. Restore volume and increase temperature, predicting the pressure ratio first. Convert 27 °C to approximately 300 K before using the equation.",
    "Use Kelvin and absolute pressure, not Celsius and gauge pressure. Real gases deviate from ideal behaviour at high pressure and low temperature, particularly near condensation. The simulation describes equilibrium states rather than the safety or engineering of actual pressurised containers."
  ],
  "trigonometry": [
    "On a unit circle an angle measured counterclockwise from the positive horizontal axis corresponds to coordinates (cos θ, sin θ). Tangent is their ratio sin θ/cos θ when cosine is nonzero. The signs of both coordinates depend on the quadrant.",
    "At 30° sine equals one half and cosine equals √3/2. Rotate to 150°: sine stays positive one half and cosine changes sign. At 210° both are negative. At 270° sine equals −1. Compare the sum of squared coordinates at different angles and verify it remains one.",
    "Tangent is undefined when cosine is zero, including 90° and 270°. Near those angles its magnitude may be large without having a finite exact value at the angle itself. Keep radians and degrees distinct. Angles separated by complete rotations describe the same circle point."
  ],
  "coin-toss-probability": [
    "For independent fair tosses heads and tails each have probability one half. A finite observed proportion is random, while the theoretical probability is fixed. The expected heads count in n trials is n/2, not a promise about any individual sequence.",
    "Run ten trials and record heads and observed fraction. Reset and repeat several times. Compare these fractions with a longer run, accumulating trials if necessary. Calculate the absolute difference from one half. Larger samples generally have less variable proportions, but improvement is not guaranteed after each new toss.",
    "A streak of tails does not increase the next independent toss's probability of heads. Equal probability does not require every short sequence to contain equal counts. The simulator assumes a fair random generator rather than measuring a physical coin. Distinguish expected value, observed frequency and certainty."
  ],
  "punnett-square": [
    "A Punnett square enumerates possible parental allele combinations for a single gene. A heterozygous parent contributes either allele with equal probability in the simple Mendelian model. Under complete dominance AA and Aa share a phenotype while aa is recessive, so phenotype and genotype ratios differ.",
    "Choose Aa for both parents and list AA, Aa, Aa and aa. Genotype probabilities are one quarter, one half and one quarter; the dominant phenotype occurs with probability three quarters. Compare AA × aa and Aa × aa. Predict the four cells before changing the parent selections.",
    "These are probabilities for each offspring, not guaranteed proportions in a family. Dominant does not mean more common, beneficial or stronger. Real inheritance can involve multiple genes, linkage, incomplete dominance and environment. The simulation assumes one autosomal gene, two alleles and simple segregation."
  ],
  "bubble-sort": [
    "Bubble sort compares adjacent elements and swaps them if they are out of order. In an ascending pass the largest unsorted value reaches the right end. Subsequent passes can exclude that completed suffix. This invariant helps establish correctness.",
    "Trace [4, 2, 3, 1]. After one pass the result is [2, 3, 1, 4], after two passes [2, 1, 3, 4], and after the third [1, 2, 3, 4]. Follow the visualizer's own array and count comparisons separately from swaps. Predict which value reaches its final position next.",
    "For shrinking passes the worst-case comparison count is n(n−1)/2, giving quadratic time. Early stopping can improve already-sorted input but depends on implementation. Equal values need not be swapped in a stable version. Bubble sort is useful pedagogically but generally inefficient for large datasets."
  ],
  "binary-search": [
    "Binary search maintains an interval of possible target positions in a sorted array. It compares the middle element with the target and discards the half that cannot contain it. Each unsuccessful comparison shrinks the interval until a match occurs or no candidates remain.",
    "For [1, 3, 5, 7, 9, 11, 13, 15, 17], target 7 first compares with 9, then 3, then 5 and finally 7. Repeat with target 8 and watch the bounds cross. Write down low, high and midpoint after each comparison to check the invariant.",
    "The input must be sorted. A found duplicate is not necessarily the first occurrence; boundary searches require a variant. Exclude the tested midpoint when updating bounds to avoid infinite loops. Logarithmic comparison complexity assumes efficient access to the middle element."
  ]
};
export const lessonNotes:Record<string,string[]>={
  "newtons-laws": [
    "Identify the object before drawing a free-body diagram. Include forces acting on that object only, choose a positive direction, and add signed force components. A horizontal surface can supply a normal force balancing gravity even while horizontal forces accelerate the object. Newton's first law describes motion when net force vanishes.",
    "Consider a 4 kg trolley pushed by 18 N with 6 N opposing friction. Net force is 12 N and acceleration is 3 m/s² forward. If the applied force equals friction, acceleration is zero. A moving trolley can continue at constant speed; a stationary trolley can remain stationary.",
    "Third-law pairs act on different bodies. The force of a book on a table and the force of the table on the book are a pair, whereas the normal force and weight acting on the book are not. Mass is measured in kilograms and weight in newtons.",
    "Draw three free-body diagrams for balanced motion, accelerating motion and two interacting objects. Compare the ideal projectile model with an object experiencing drag, explaining why the horizontal velocity is constant only under its stated assumptions. Check all units in the worked calculations."
  ],
  "ohms-law": [
    "Current measures charge per unit time and voltage measures energy per unit charge. For an ohmic conductor under unchanged physical conditions, resistance remains the ratio V/I. The inverse relation between resistance and current holds only when voltage is fixed.",
    "A 12 V source across 4 Ω gives 3 A and 36 W. Two 4 Ω resistors in series give 8 Ω and 1.5 A. Connected in parallel they give 2 Ω and 6 A total; each branch carries 3 A. Compare these predictions using the virtual circuit.",
    "Series components share current and divide voltage. Parallel branches share voltage and divide current. Power is energy per time; multiplying it by duration gives energy. A higher resistance does not always mean lower power, because the result depends on whether voltage or current is held fixed.",
    "For revision predict readings for three resistances at fixed voltage. Plot current against voltage at fixed resistance and explain its slope. Discuss constant-temperature and ideal-source assumptions. Real electrical work requires appropriate equipment and supervision, unlike this mathematical model."
  ],
  "quadratic-equations": [
    "Move all terms to one side and identify a, b and c with their signs. If factorisation is convenient, apply the zero-product property. Otherwise calculate the discriminant and use the quadratic formula. Completing the square provides another method and explains why the formula works.",
    "For 2x² − 7x + 3 = 0, the discriminant is 49 − 24 = 25. The roots are 3 and one half. Substitute both in the original expression. Their sum is 7/2 and product 3/2, matching −b/a and c/a.",
    "A positive discriminant gives two distinct real roots; zero gives a repeated real root; a negative value gives no real roots. The corresponding parabola crosses, touches or misses the horizontal axis. Its leading coefficient controls opening direction, and its constant term gives the vertical intercept.",
    "Solve x² + 4x + 4 = 0 and x² + 4x + 5 = 0. Compare discriminants and factor the first. Use the simulator to vary c while holding other coefficients fixed. Connect the plotted change with exact algebra, remembering that graphs have finite display ranges."
  ],
  "human-heart": [
    "The heart is two connected pumps. Atria receive blood, while ventricles eject it. The right side sends blood through pulmonary circulation for gas exchange; the left side sends blood through systemic circulation to tissues. Valves respond to pressure differences and reduce backflow.",
    "Trace the pulmonary circuit from right ventricle through pulmonary arteries, lung capillaries and pulmonary veins to left atrium. Trace systemic circulation from left ventricle through aorta, tissue capillaries and veins to right atrium. Diffusion across capillary barriers enables gas exchange.",
    "The left ventricular wall is normally thicker because systemic circulation requires greater pressure. This does not mean it pumps a greater long-term volume; both circuits are connected in series. Atrioventricular valves close during ventricular contraction, and semilunar valves open when pressure conditions permit.",
    "Draw four chambers and connect both circuits using arrows. Label pulmonary arteries and veins as exceptions to the common association between vessel type and oxygen content. Explain how valves support one-way flow. This is educational normal anatomy, not individual medical advice."
  ],
  "photosynthesis": [
    "Photosynthesis converts light energy into chemical energy. Chloroplast pigments absorb light. Light-dependent reactions in thylakoid membranes produce ATP and reducing power and release oxygen from water. Carbon fixation in the stroma uses these energy carriers to build organic molecules from carbon dioxide.",
    "The overall equation is a simplified net representation, not a single reaction. Carbon dioxide enters leaves mainly through stomata and water arrives through vascular tissue. Oxygen released originates from water. Sugars can be used for respiration, stored as starch or transported within the plant.",
    "A controlled starch-test example compares illuminated and shaded portions of a previously destarched leaf. Under suitable conditions, starch formation is associated with illumination. Comparing two regions under otherwise similar conditions is stronger evidence than observing one region alone. Actual laboratory procedures require supervision.",
    "Light intensity, carbon dioxide and temperature can limit photosynthesis. Increasing one factor may cease to help once another limits the rate. Plants also respire in darkness and light. For revision identify the locations of the reaction groups and explain how a limiting factor changes a controlled experiment."
  ],
  "fundamental-rights": [
    "Part III of the Constitution contains fundamental rights. Read the actual articles because eligible right-holders and permitted limitations differ. Article 14 is framed for persons, while Article 19 enumerates freedoms for citizens. Do not assume all rights have the same scope.",
    "Article 21 concerns life and personal liberty according to procedure established by law. Article 25 concerns conscience and religion subject to its stated qualifications. Articles 29 and 30 concern cultural and educational protections. These summaries are starting points, not substitutes for the official wording or judicial interpretation.",
    "Article 32 enables movement of the Supreme Court for enforcement of fundamental rights. Article 226 gives High Courts writ jurisdiction for fundamental rights and other purposes. Distinguish these provisions by authority and scope rather than memorising them as interchangeable remedies.",
    "Create a revision table with article number, protected interest, eligible right-holder and stated limitations. Compare Articles 14, 19, 21, 25 and 32 using the official Constitution. Distinguish fundamental rights from directive principles and fundamental duties. This is general educational material, not legal advice."
  ]
};
