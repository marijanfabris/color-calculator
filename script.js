

const saturation =
    document.getElementById("saturation");

const pickerCursor =
    document.getElementById("pickerCursor");

const hueSlider =
    document.getElementById("hueSlider");

const colorPreview =
    document.getElementById("colorPreview");

const hexValue =
    document.getElementById("hexValue");

const waxMass =
    document.getElementById("waxMass");


const blackPercent =
    document.getElementById("blackPercent");
const bluePercent =
    document.getElementById("bluePercent");
const magentaPercent =
    document.getElementById("magentaPercent");
const yellowPercent =
    document.getElementById("yellowPercent");
const orangePercent =
    document.getElementById("orangePercent");
const greenPercent =
    document.getElementById("greenPercent");


const blackGrams =
    document.getElementById("blackGrams");

const blueGrams =
    document.getElementById("blueGrams");

const magentaGrams =
    document.getElementById("magentaGrams");

const yellowGrams =
    document.getElementById("yellowGrams");

const orangeGrams =
    document.getElementById("orangeGrams");

const greenGrams =
    document.getElementById("greenGrams");



let hue = 30;
let saturationValue = 0.5;
let brightness = 0.5;


function hsvToRgb(h, s, v) {

    const c = v * s;

    const x =
        c *
        (1 - Math.abs((h / 60) % 2 - 1));

    const m = v - c;

    let r = 0;
    let g = 0;
    let b = 0;


    if (h < 60) {

        r = c;
        g = x;

    } else if (h < 120) {

        r = x;
        g = c;

    } else if (h < 180) {

        g = c;
        b = x;

    } else if (h < 240) {

        g = x;
        b = c;

    } else if (h < 300) {

        r = x;
        b = c;

    } else {

        r = c;
        b = x;

    }


    return {

        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)

    };
}


function rgbToHex(r, g, b) {

    return "#" +

        [r, g, b]

            .map(value =>
                value
                    .toString(16)
                    .padStart(2, "0")
            )

            .join("")

            .toUpperCase();
}


function hexToRgb(hex) {

    return {

        r: parseInt(
            hex.substring(0, 2),
            16
        ),

        g: parseInt(
            hex.substring(2, 4),
            16
        ),

        b: parseInt(
            hex.substring(4, 6),
            16
        )

    };
}


function rgbToHsv(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;


    const max =
        Math.max(r, g, b);

    const min =
        Math.min(r, g, b);

    const delta =
        max - min;


    let h = 0;


    if (delta !== 0) {

        if (max === r) {

            h =
                60 *
                (((g - b) / delta) % 6);

        } else if (max === g) {

            h =
                60 *
                ((b - r) / delta + 2);

        } else {

            h =
                60 *
                ((r - g) / delta + 4);

        }
    }


    if (h < 0) {
        h += 360;
    }


    const s =
        max === 0
            ? 0
            : delta / max;


    const v = max;


    return {
        h: h,
        s: s,
        v: v
    };
}



function updateColorFromPosition(
    clientX,
    clientY
) {

    const rect =
        saturation.getBoundingClientRect();


    let x =
        (clientX - rect.left) /
        rect.width;

    let y =
        (clientY - rect.top) /
        rect.height;


    x =
        Math.max(
            0,
            Math.min(1, x)
        );

    y =
        Math.max(
            0,
            Math.min(1, y)
        );


    saturationValue = x;

    brightness = 1 - y;


    pickerCursor.style.left =
        `${x * 100}%`;

    pickerCursor.style.top =
        `${y * 100}%`;


    updateColor();
}


function updateColor() {

    const rgb =
        hsvToRgb(
            hue,
            saturationValue,
            brightness
        );


    const hex =
        rgbToHex(
            rgb.r,
            rgb.g,
            rgb.b
        );


    saturation.style.background =
        `linear-gradient(to bottom, transparent, black),
                 linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`;


    colorPreview.style.backgroundColor =
        hex;


    hexValue.value =
        hex.substring(1);


    updateCalculator(
        rgb.r,
        rgb.g,
        rgb.b
    );
}
function rgbToLab(r, g, b) {

    // sRGB (0-255) → normalized sRGB (0-1)

    r /= 255;
    g /= 255;
    b /= 255;


    // sRGB → linear RGB

    function linearize(value) {

        if (value <= 0.04045) {
            return value / 12.92;
        }

        return Math.pow(
            (value + 0.055) / 1.055,
            2.4
        );
    }

    r = linearize(r);
    g = linearize(g);
    b = linearize(b);


    // Linear sRGB → CIE XYZ
    // sRGB D65 matrix

    const x =
        0.4124564 * r +
        0.3575761 * g +
        0.1804375 * b;

    const y =
        0.2126729 * r +
        0.7151522 * g +
        0.0721750 * b;

    const z =
        0.0193339 * r +
        0.1191920 * g +
        0.9503041 * b;


    // CIE XYZ D65 reference white

    const Xn = 0.95047;
    const Yn = 1.00000;
    const Zn = 1.08883;


    // Normalize XYZ

    const xRatio = x / Xn;
    const yRatio = y / Yn;
    const zRatio = z / Zn;


    // CIE Lab constants

    const epsilon = 216 / 24389;
    const kappa = 24389 / 27;


    function f(t) {

        if (t > epsilon) {
            return Math.cbrt(t);
        }

        return (kappa * t + 16) / 116;
    }


    const fx = f(xRatio);
    const fy = f(yRatio);
    const fz = f(zRatio);


    // XYZ → CIELAB

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bLab = 200 * (fy - fz);


    return {
        L: L,
        a: a,
        b: bLab
    };
}

function labDistance(a, b) {

    const dL = a.L - b.L;
    const da = a.a - b.a;
    const db = a.b - b.b;

    return Math.sqrt(
        dL * dL +
        da * da +
        db * db
    );
}



function srgbToLinear(value) {

    value /= 255;

    if (value <= 0.04045) {
        return value / 12.92;
    }

    return Math.pow(
        (value + 0.055) / 1.055,
        2.4
    );
}


function linearToSrgb(value) {

    if (value <= 0.0031308) {
        return value * 12.92;
    }

    return 1.055 *
        Math.pow(value, 1 / 2.4) -
        0.055;
}


function updateCalculator(r, g, b) {

    const wax = Number(waxMass.value) || 0;

    // Calibration candles use 0.4% dye by wax mass.
    const totalColorant = wax * 0.004;


    /*
    * Measured candle colors at 0.4% dye by wax mass.
    * These RGB samples are used as an approximate mixing model.
     */

    const colors = [

        { name: "black",   r: 62,  g: 61,  b: 72 },
        { name: "blue",    r: 44,  g: 94,  b: 227 },
        { name: "magenta", r: 255, g: 125, b: 202 },
        { name: "yellow",  r: 255, g: 214, b: 89 },
        { name: "orange",  r: 255, g: 110, b: 1 },
        { name: "green",   r: 77,  g: 183, b: 117 },

    ];


    /*
     * sRGB → linear RGB
     */

    function srgbToLinear(value) {

        value /= 255;

        return value <= 0.04045
            ? value / 12.92
            : Math.pow(
                (value + 0.055) / 1.055,
                2.4
            );

    }


    /*
    * Convert the measured color samples to linear RGB.
     */

    const linearColors = colors.map(color => ({

        r: srgbToLinear(color.r),
        g: srgbToLinear(color.g),
        b: srgbToLinear(color.b)

    }));


    /*
     * Convert target to linear RGB.
     */

    const target = {

        r: srgbToLinear(r),
        g: srgbToLinear(g),
        b: srgbToLinear(b)

    };

    const targetLab = rgbToLab(r, g, b);


    const white = { r: 1, g: 1, b: 1 };
    const mixtureColors = [white, ...linearColors];


    function getMixedRGB(weights) {
        let mixedR = 0;
        let mixedG = 0;
        let mixedB = 0;

        for (let i = 0; i < mixtureColors.length; i++) {
            mixedR += weights[i] * mixtureColors[i].r;
            mixedG += weights[i] * mixtureColors[i].g;
            mixedB += weights[i] * mixtureColors[i].b;
        }

        return {
            r: mixedR,
            g: mixedG,
            b: mixedB
        };
    }


    function getErrorForMixedRGB(mixed) {
        const mixedLab = rgbToLab(
            linearToSrgb(mixed.r) * 255,
            linearToSrgb(mixed.g) * 255,
            linearToSrgb(mixed.b) * 255
        );

        const deltaE = labDistance(targetLab, mixedLab);
        return deltaE * deltaE;
    }


    function getError(weights) {
        return getErrorForMixedRGB(getMixedRGB(weights));
    }


    function projectToSimplex(values) {
        const sorted = [...values].sort((a, b) => b - a);
        let cumulative = 0;
        let thresholdIndex = 0;

        for (let index = 0; index < sorted.length; index++) {
            cumulative += sorted[index];
            const threshold = (cumulative - 1) / (index + 1);

            if (sorted[index] > threshold) {
                thresholdIndex = index + 1;
            }
        }

        const threshold = (
            sorted.slice(0, thresholdIndex).reduce((sum, value) => sum + value, 0) - 1
        ) / thresholdIndex;

        return values.map(value => Math.max(0, value - threshold));
    }


    function refineSubset(indices, initialRatios) {
        let subsetRatios = projectToSimplex(initialRatios);

        function expandRatios(values) {
            const expanded = new Array(mixtureColors.length).fill(0);

            for (let index = 0; index < indices.length; index++) {
                expanded[indices[index]] = values[index];
            }

            return expanded;
        }

        let expandedRatios = expandRatios(subsetRatios);
        let currentError = getError(expandedRatios);

        for (let iteration = 0; iteration < 40; iteration++) {
            const mixed = getMixedRGB(expandedRatios);
            const epsilon = 1e-5;
            const gradientRGB = {};

            for (const channel of ["r", "g", "b"]) {
                const higher = { ...mixed, [channel]: mixed[channel] + epsilon };
                const lower = { ...mixed, [channel]: mixed[channel] - epsilon };

                gradientRGB[channel] = (
                    getErrorForMixedRGB(higher) - getErrorForMixedRGB(lower)
                ) / (2 * epsilon);
            }

            const gradient = indices.map(index => {
                const color = mixtureColors[index];
                return gradientRGB.r * color.r +
                    gradientRGB.g * color.g +
                    gradientRGB.b * color.b;
            });

            let step = 1e-4;
            let improved = false;

            for (let attempt = 0; attempt < 20; attempt++) {
                const nextRatios = projectToSimplex(
                    subsetRatios.map((value, index) => value - step * gradient[index])
                );
                const nextExpanded = expandRatios(nextRatios);
                const nextError = getError(nextExpanded);

                if (nextError < currentError - 1e-12) {
                    subsetRatios = nextRatios;
                    expandedRatios = nextExpanded;
                    currentError = nextError;
                    improved = true;
                    break;
                }

                step /= 2;
            }

            if (!improved) {
                break;
            }
        }

        return {
            ratios: expandedRatios,
            error: currentError
        };
    }


    function solveLinearSystem(matrix, values) {
        const size = values.length;
        const augmented = matrix.map((row, index) => [...row, values[index]]);

        for (let column = 0; column < size; column++) {
            let pivotRow = column;

            for (let row = column + 1; row < size; row++) {
                if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) {
                    pivotRow = row;
                }
            }

            if (Math.abs(augmented[pivotRow][column]) < 1e-12) {
                return null;
            }

            [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];

            for (let row = column + 1; row < size; row++) {
                const factor = augmented[row][column] / augmented[column][column];

                for (let entry = column; entry <= size; entry++) {
                    augmented[row][entry] -= factor * augmented[column][entry];
                }
            }
        }

        const solution = new Array(size).fill(0);

        for (let row = size - 1; row >= 0; row--) {
            let value = augmented[row][size];

            for (let column = row + 1; column < size; column++) {
                value -= augmented[row][column] * solution[column];
            }

            solution[row] = value / augmented[row][row];
        }

        return solution;
    }


    let ratios = null;
    let bestError = Infinity;
    let bestDyeRatio = Infinity;
    let bestPigmentCount = Infinity;


    function evaluateSubset(indices) {
        const count = indices.length;
        const matrix = Array.from(
            { length: count + 1 },
            () => new Array(count + 1).fill(0)
        );
        const values = new Array(count + 1).fill(0);

        for (let row = 0; row < count; row++) {
            const color = mixtureColors[indices[row]];
            values[row] =
                color.r * target.r +
                color.g * target.g +
                color.b * target.b;

            for (let column = 0; column < count; column++) {
                const otherColor = mixtureColors[indices[column]];
                matrix[row][column] =
                    color.r * otherColor.r +
                    color.g * otherColor.g +
                    color.b * otherColor.b;
            }

            matrix[row][count] = 1;
            matrix[count][row] = 1;
        }

        values[count] = 1;

        const subsetRatios = solveLinearSystem(matrix, values);

        const starts = [new Array(count).fill(1 / count)];

        if (subsetRatios && subsetRatios.every(value => value >= -1e-9)) {
            starts.push(subsetRatios.map(value => Math.max(0, value)));
        }

        for (const start of starts) {
            const candidate = refineSubset(indices, start);
            const dyeRatio = 1 - candidate.ratios[0];
            const pigmentCount = candidate.ratios.slice(1).filter(value => value > 1e-9).length;
            const sameColor = Math.abs(candidate.error - bestError) <= 1e-10;
            const usesLessDye = dyeRatio < bestDyeRatio - 1e-9;
            const sameDye = Math.abs(dyeRatio - bestDyeRatio) <= 1e-9;

            if (
                candidate.error < bestError - 1e-10 ||
                (sameColor && (usesLessDye || (sameDye && pigmentCount < bestPigmentCount)))
            ) {
                ratios = candidate.ratios;
                bestError = candidate.error;
                bestDyeRatio = dyeRatio;
                bestPigmentCount = pigmentCount;
            }
        }
    }


    function searchSubsets(start, indices) {
        if (indices.length > 0) {
            evaluateSubset(indices);
        }

        if (indices.length === 4) {
            return;
        }

        for (let index = start; index < mixtureColors.length; index++) {
            indices.push(index);
            searchSubsets(index + 1, indices);
            indices.pop();
        }
    }


    searchSubsets(0, []);


    /*
     * Calculate final result.
     */

    const percentageElements = [

        blackPercent,
        bluePercent,
        magentaPercent,
        yellowPercent,
        orangePercent,
        greenPercent

    ];


    const gramElements = [

        blackGrams,
        blueGrams,
        magentaGrams,
        yellowGrams,
        orangeGrams,
        greenGrams

    ];


    /*
     * Display percentages and grams.
     */

    const dyeRatio = Math.max(0, 1 - ratios[0]);
    const hasDye = dyeRatio > 1e-8;


    for (let i = 0; i < colors.length; i++) {

        const dyeShare = hasDye
            ? ratios[i + 1] / dyeRatio
            : 0;

        percentageElements[i].textContent =
            (dyeShare * 100).toFixed(1) + "%";


        gramElements[i].textContent =
            (totalColorant * ratios[i + 1]).toFixed(3) + " g";

    }

}

saturation.addEventListener(
    "pointerdown",
    event => {

        saturation.setPointerCapture(
            event.pointerId
        );

        updateColorFromPosition(
            event.clientX,
            event.clientY
        );
    }
);


saturation.addEventListener(
    "pointermove",
    event => {

        if (event.buttons !== 1) {
            return;
        }

        updateColorFromPosition(
            event.clientX,
            event.clientY
        );
    }
);


hueSlider.addEventListener(
    "input",
    () => {

        hue =
            Number(hueSlider.value);

        updateColor();
    }
);


waxMass.addEventListener(
    "input",
    () => {

        updateColor();
    }
);


hexValue.addEventListener(
    "input",
    () => {

        const hex =
            hexValue.value;


        if (
            !/^[0-9A-Fa-f]{6}$/.test(hex)
        ) {
            return;
        }


        const rgb =
            hexToRgb(hex);


        const hsv =
            rgbToHsv(
                rgb.r,
                rgb.g,
                rgb.b
            );


        hue =
            hsv.h;

        saturationValue =
            hsv.s;

        brightness =
            hsv.v;


        hueSlider.value =
            hue;


        pickerCursor.style.left =
            `${saturationValue * 100}%`;


        pickerCursor.style.top =
            `${(1 - brightness) * 100}%`;


        updateColor();
    }
);


pickerCursor.style.left =
    "50%";

pickerCursor.style.top =
    "50%";


updateColor();

