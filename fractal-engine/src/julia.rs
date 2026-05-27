use crate::fractal::{Fractal, IterResult};

pub struct Julia {
    pub c_re: f64,
    pub c_im: f64,
}

impl Fractal for Julia {
    fn iterate(&self, x: f64, y: f64, max_iter: u32) -> IterResult {
        let mut zr = x;
        let mut zi = y;
        let mut i = 0u32;

        while i < max_iter {
            let zr2 = zr * zr;
            let zi2 = zi * zi;
            if zr2 + zi2 > 4.0 {
                let smooth = i as f64 + 1.0 - (zr2 + zi2).ln().ln() / std::f64::consts::LN_2;
                return IterResult { iterations: i, smooth_value: smooth };
            }
            zi = 2.0 * zr * zi + self.c_im;
            zr = zr2 - zi2 + self.c_re;
            i += 1;
        }

        IterResult { iterations: max_iter, smooth_value: max_iter as f64 }
    }
}
