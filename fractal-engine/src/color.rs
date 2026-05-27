pub enum Palette {
    Classic,
    Fire,
    Ocean,
    Psychedelic,
    Grayscale,
}

impl Palette {
    pub fn from_str(s: &str) -> Self {
        match s {
            "fire" => Palette::Fire,
            "ocean" => Palette::Ocean,
            "psychedelic" => Palette::Psychedelic,
            "grayscale" => Palette::Grayscale,
            _ => Palette::Classic,
        }
    }

    pub fn color(&self, iterations: u32, max_iter: u32, smooth: f64) -> [u8; 4] {
        if iterations >= max_iter {
            return [0, 0, 0, 255];
        }

        match self {
            Palette::Classic => Self::classic(smooth, max_iter),
            Palette::Fire => Self::fire(smooth, max_iter),
            Palette::Ocean => Self::ocean(smooth, max_iter),
            Palette::Psychedelic => Self::psychedelic(smooth),
            Palette::Grayscale => Self::grayscale(smooth, max_iter),
        }
    }

    pub fn color_newton(&self, iterations: u32, max_iter: u32, smooth: f64) -> [u8; 4] {
        if iterations >= max_iter {
            return [0, 0, 0, 255];
        }

        let root_idx = (smooth / max_iter as f64).floor() as u32;
        let actual_iter = smooth - root_idx as f64 * max_iter as f64;
        let brightness = 1.0 - (actual_iter / max_iter as f64).min(1.0);
        let b = (brightness * 255.0) as u8;

        match root_idx {
            0 => [b, (b as f64 * 0.3) as u8, (b as f64 * 0.3) as u8, 255],
            1 => [(b as f64 * 0.3) as u8, b, (b as f64 * 0.3) as u8, 255],
            2 => [(b as f64 * 0.3) as u8, (b as f64 * 0.3) as u8, b, 255],
            _ => [b, b, b, 255],
        }
    }

    fn classic(smooth: f64, max_iter: u32) -> [u8; 4] {
        let t = smooth / max_iter as f64;
        let r = (9.0 * (1.0 - t) * t * t * t * 255.0) as u8;
        let g = (15.0 * (1.0 - t) * (1.0 - t) * t * t * 255.0) as u8;
        let b = (8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t * 255.0) as u8;
        [r, g, b, 255]
    }

    fn fire(smooth: f64, max_iter: u32) -> [u8; 4] {
        let t = smooth / max_iter as f64;
        let r = (255.0 * (3.0 * t).min(1.0)) as u8;
        let g = (255.0 * (3.0 * t - 1.0).max(0.0).min(1.0)) as u8;
        let b = (255.0 * (3.0 * t - 2.0).max(0.0).min(1.0)) as u8;
        [r, g, b, 255]
    }

    fn ocean(smooth: f64, max_iter: u32) -> [u8; 4] {
        let t = smooth / max_iter as f64;
        let r = (255.0 * (2.0 * t - 1.0).max(0.0)) as u8;
        let g = (255.0 * (2.0 * t - 0.5).max(0.0).min(1.0)) as u8;
        let b = (255.0 * t.sqrt()) as u8;
        [r, g, b, 255]
    }

    fn psychedelic(smooth: f64) -> [u8; 4] {
        let hue = (smooth * 0.1) % 1.0;
        let (r, g, b) = hsv_to_rgb(hue, 0.9, 1.0);
        [r, g, b, 255]
    }

    fn grayscale(smooth: f64, max_iter: u32) -> [u8; 4] {
        let t = smooth / max_iter as f64;
        let v = (255.0 * t.sqrt()) as u8;
        [v, v, v, 255]
    }
}

fn hsv_to_rgb(h: f64, s: f64, v: f64) -> (u8, u8, u8) {
    let i = (h * 6.0).floor() as u32;
    let f = h * 6.0 - i as f64;
    let p = v * (1.0 - s);
    let q = v * (1.0 - f * s);
    let t = v * (1.0 - (1.0 - f) * s);

    let (r, g, b) = match i % 6 {
        0 => (v, t, p),
        1 => (q, v, p),
        2 => (p, v, t),
        3 => (p, q, v),
        4 => (t, p, v),
        _ => (v, p, q),
    };

    ((r * 255.0) as u8, (g * 255.0) as u8, (b * 255.0) as u8)
}
