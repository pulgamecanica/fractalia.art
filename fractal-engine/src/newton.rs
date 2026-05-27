use crate::fractal::{Fractal, IterResult};

/// Newton fractal for z^3 - 1 = 0
/// Roots: 1, e^(2πi/3), e^(4πi/3)
pub struct Newton;

impl Fractal for Newton {
    fn iterate(&self, x: f64, y: f64, max_iter: u32) -> IterResult {
        let mut zr = x;
        let mut zi = y;
        let tolerance = 1e-6;

        let roots = [
            (1.0, 0.0),
            (-0.5, 0.8660254037844386),
            (-0.5, -0.8660254037844386),
        ];

        for i in 0..max_iter {
            // f(z) = z^3 - 1, f'(z) = 3z^2
            let zr2 = zr * zr;
            let zi2 = zi * zi;

            // z^2
            let z2r = zr2 - zi2;
            let z2i = 2.0 * zr * zi;

            // z^3
            let z3r = z2r * zr - z2i * zi;
            let z3i = z2r * zi + z2i * zr;

            // f(z) = z^3 - 1
            let fr = z3r - 1.0;
            let fi = z3i;

            // f'(z) = 3z^2
            let denom = 3.0 * (z2r * z2r + z2i * z2i);
            if denom < 1e-12 {
                return IterResult { iterations: i, smooth_value: i as f64 };
            }

            // z - f(z)/f'(z)
            let dr = (fr * z2r + fi * z2i) / denom;
            let di = (fi * z2r - fr * z2i) / denom;
            zr -= dr;
            zi -= di;

            for (root_idx, &(rr, ri)) in roots.iter().enumerate() {
                let dx = zr - rr;
                let dy = zi - ri;
                if dx * dx + dy * dy < tolerance {
                    // Encode root index in the smooth value for coloring
                    let smooth = i as f64 + root_idx as f64 * max_iter as f64;
                    return IterResult { iterations: i, smooth_value: smooth };
                }
            }
        }

        IterResult { iterations: max_iter, smooth_value: max_iter as f64 }
    }
}
