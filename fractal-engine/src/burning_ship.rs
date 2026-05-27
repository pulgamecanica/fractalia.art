use crate::fractal::{Fractal, IterResult};

pub struct BurningShip;

impl Fractal for BurningShip {
    fn iterate(&self, x: f64, y: f64, max_iter: u32) -> IterResult {
        let mut zr: f64 = 0.0;
        let mut zi: f64 = 0.0;
        let mut i = 0u32;

        while i < max_iter {
            let zr2 = zr * zr;
            let zi2 = zi * zi;
            if zr2 + zi2 > 4.0 {
                let smooth = i as f64 + 1.0 - (zr2 + zi2).ln().ln() / std::f64::consts::LN_2;
                return IterResult { iterations: i, smooth_value: smooth };
            }
            zi = (2.0 * zr * zi).abs() + y;
            zr = zr2 - zi2 + x;
            i += 1;
        }

        IterResult { iterations: max_iter, smooth_value: max_iter as f64 }
    }
}
