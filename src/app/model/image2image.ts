export class Image2ImageSettings {
  prompt: string = '';
  negative_prompt: string = '';
  style_selections: string[] = [];
  performance_selection: string = '';
  aspect_ratios_selection: string = '';
  image_number: number = 1;
  image_seed: number = -1;
  sharpness: number = 2;
  guidance_scale: number = 4;
  base_model_name: string = '';
  refiner_model_name: string = '';
  refiner_switch: number = 0.5;
  loras: Lora[] = [];
  advanced_params: AdvancedParams = new AdvancedParams();
  require_base64: boolean = false;
  async_process: boolean = false;
  image_prompts: ImagePrompt[] = [];

  constructor(data?: Partial<Image2ImageSettings>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static fromJSON(json: string): Image2ImageSettings {
    const data = JSON.parse(json) as Partial<Image2ImageSettings>;
    return new Image2ImageSettings(data);
  }


}

class Lora {
  model_name: string;
  weight: number;

  constructor() {
    this.model_name = '';
    this.weight = 0;
  }
}

class AdvancedParams {
  disable_preview: boolean = false;
  adm_scaler_positive: number = 1.5;
  adm_scaler_negative: number = 0.8;
  adm_scaler_end: number = 0.3;
  refiner_swap_method: string = "joint";
  adaptive_cfg: number = 7;
  sampler_name: string = "dpmpp_2m_sde_gpu";
  scheduler_name: string = "karras";
  overwrite_step: number = -1;
  overwrite_switch: number = -1;
  overwrite_width: number = -1;
  overwrite_height: number = -1;
  overwrite_vary_strength: number = -1;
  overwrite_upscale_strength: number = -1;
  mixing_image_prompt_and_vary_upscale: boolean = false;
  mixing_image_prompt_and_inpaint: boolean = false;
  debugging_cn_preprocessor: boolean = false;
  skipping_cn_preprocessor: boolean = false;
  controlnet_softness: number = 0.25;
  canny_low_threshold: number = 64;
  canny_high_threshold: number = 128;
  freeu_enabled: boolean = false;
  freeu_b1: number = 1.01;
  freeu_b2: number = 1.02;
  freeu_s1: number = 0.99;
  freeu_s2: number = 0.95;
  debugging_inpaint_preprocessor: boolean = false;
  inpaint_disable_initial_latent: boolean = false;
  inpaint_engine: string = "v1";
  inpaint_strength: number = 1;
  inpaint_respective_field: number = 1;

  constructor() {

  }
}

export class ImagePrompt {
  cn_img: string;
  cn_stop: number;
  cn_weight: number;
  cn_type: string;

  constructor() {
    this.cn_img = '';
    this.cn_stop = 1;
    this.cn_weight = 2;
    this.cn_type = 'ImagePrompt';
  }
}
