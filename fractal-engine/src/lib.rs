mod burning_ship;
mod color;
mod fractal;
mod julia;
mod mandelbrot;
mod newton;
mod viewport;

use burning_ship::BurningShip;
use color::Palette;
use fractal::Fractal;
use julia::Julia;
use mandelbrot::Mandelbrot;
use newton::Newton;
use viewport::Viewport;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn render_fractal(
    fractal_type: &str,
    center_x: f64,
    center_y: f64,
    zoom: f64,
    width: u32,
    height: u32,
    max_iterations: u32,
    palette_name: &str,
    params_json: &str,
) -> Vec<u8> {
    let vp = Viewport { center_x, center_y, zoom, width, height };
    let palette = Palette::from_str(palette_name);
    let is_newton = fractal_type == "newton";

    let fractal: Box<dyn Fractal> = match fractal_type {
        "julia" => {
            let params: serde_json::Value = serde_json::from_str(params_json).unwrap_or_default();
            let c_re = params.get("c_re").and_then(|v| v.as_f64()).unwrap_or(-0.7);
            let c_im = params.get("c_im").and_then(|v| v.as_f64()).unwrap_or(0.27015);
            Box::new(Julia { c_re, c_im })
        }
        "burning_ship" => Box::new(BurningShip),
        "newton" => Box::new(Newton),
        _ => Box::new(Mandelbrot),
    };

    let mut pixels = vec![0u8; (width * height * 4) as usize];

    for py in 0..height {
        for px in 0..width {
            let (x, y) = vp.pixel_to_complex(px, py);
            let result = fractal.iterate(x, y, max_iterations);

            let rgba = if is_newton {
                palette.color_newton(result.iterations, max_iterations, result.smooth_value)
            } else {
                palette.color(result.iterations, max_iterations, result.smooth_value)
            };

            let idx = ((py * width + px) * 4) as usize;
            pixels[idx] = rgba[0];
            pixels[idx + 1] = rgba[1];
            pixels[idx + 2] = rgba[2];
            pixels[idx + 3] = rgba[3];
        }
    }

    pixels
}
