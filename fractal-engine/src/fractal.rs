pub struct IterResult {
    pub iterations: u32,
    pub smooth_value: f64,
}

pub trait Fractal {
    fn iterate(&self, x: f64, y: f64, max_iter: u32) -> IterResult;
}
