

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


const cyanPercent =
    document.getElementById("cyanPercent");

const magentaPercent =
    document.getElementById("magentaPercent");

const yellowPercent =
    document.getElementById("yellowPercent");

const blackPercent =
    document.getElementById("blackPercent");


const cyanGrams =
    document.getElementById("cyanGrams");

const magentaGrams =
    document.getElementById("magentaGrams");

const yellowGrams =
    document.getElementById("yellowGrams");

const blackGrams =
    document.getElementById("blackGrams");


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


function rgbToCmyk(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;


    const k =
        1 - Math.max(r, g, b);


    if (k === 1) {

        return {
            c: 0,
            m: 0,
            y: 0,
            k: 1
        };
    }


    const c =
        (1 - r - k) /
        (1 - k);

    const m =
        (1 - g - k) /
        (1 - k);

    const y =
        (1 - b - k) /
        (1 - k);


    return {
        c,
        m,
        y,
        k
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


function updateCalculator(r, g, b) {

    const cmyk =
        rgbToCmyk(r, g, b);


    const wax =
        Number(waxMass.value) || 0;


    const c =
        cmyk.c * 100;

    const m =
        cmyk.m * 100;

    const y =
        cmyk.y * 100;

    const k =
        cmyk.k * 100;


    cyanPercent.textContent =
        c.toFixed(1) + "%";

    magentaPercent.textContent =
        m.toFixed(1) + "%";

    yellowPercent.textContent =
        y.toFixed(1) + "%";

    blackPercent.textContent =
        k.toFixed(1) + "%";


    cyanGrams.textContent =
        (wax * cmyk.c).toFixed(0) +
        " g";

    magentaGrams.textContent =
        (wax * cmyk.m).toFixed(0) +
        " g";

    yellowGrams.textContent =
        (wax * cmyk.y).toFixed(0) +
        " g";

    blackGrams.textContent =
        (wax * cmyk.k).toFixed(0) +
        " g";
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

