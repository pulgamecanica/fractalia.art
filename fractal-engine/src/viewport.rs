pub struct Viewport {
    pub center_x: f64,
    pub center_y: f64,
    pub zoom: f64,
    pub width: u32,
    pub height: u32,
}

impl Viewport {
    pub fn pixel_to_complex(&self, px: u32, py: u32) -> (f64, f64) {
        let aspect = self.width as f64 / self.height as f64;
        let view_width = 4.0 / self.zoom;
        let view_height = view_width / aspect;

        let x = self.center_x + (px as f64 / self.width as f64 - 0.5) * view_width;
        let y = self.center_y + (py as f64 / self.height as f64 - 0.5) * view_height;
        (x, y)
    }
}
