export class ImageSettings {
  prompt: string = '';
  negative_prompt: string = '';
  style_selections: string[] = [];
  performance_selection: string = '';
  aspect_ratios_selection: string = '';
  image_number: number = 0;
  image_seed: number = -1;
  sharpness: number = 0;
  guidance_scale: number = 0;
  base_model_name: string = '';
  refiner_model_name: string = '';
  refiner_switch: number = 0;
  loras: Lora[] = [];
  advanced_params: AdvancedParams = new AdvancedParams();
  require_base64: boolean = false;
  async_process: boolean = false;

  constructor(data?: Partial<ImageSettings>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static fromJSON(json: string): ImageSettings {
    const data = JSON.parse(json) as Partial<ImageSettings>;
    return new ImageSettings(data);
  }
}

export class Lora {
  model_name: string = '';
  weight: number = 0;
}

export class AdvancedParams {
  disable_preview: boolean = false;
  adm_scaler_positive: number = 0;
  adm_scaler_negative: number = 0;
  adm_scaler_end: number = 0;
  refiner_swap_method: string = '';
  adaptive_cfg: number = 0;
  sampler_name: string = '';
  scheduler_name: string = '';
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
  controlnet_softness: number = 0;
  canny_low_threshold: number = 0;
  canny_high_threshold: number = 0;
  freeu_enabled: boolean = false;
  freeu_b1: number = 0;
  freeu_b2: number = 0;
  freeu_s1: number = 0;
  freeu_s2: number = 0;
  debugging_inpaint_preprocessor: boolean = false;
  inpaint_disable_initial_latent: boolean = false;
  inpaint_engine: string = '';
  inpaint_strength: number = 0;
  inpaint_respective_field: number = 0;
}

export class ImageData {
  base64: string;
  url: string;
  seed: string;
  finish_reason: string;

  constructor(base64: string, url: string, seed: string, finish_reason: string) {
    this.base64 = base64;
    this.url = url;
    this.seed = seed;
    this.finish_reason = finish_reason;
  }
}

export class JobStatus {
  running_size: number;
  finished_size: number;
  last_job_id: number;

  constructor(running_size: number, finished_size: number, last_job_id: number) {
    this.running_size = running_size;
    this.finished_size = finished_size;
    this.last_job_id = last_job_id;
  }
}


export class JobResult {
  base64: string | null;
  url: string;
  seed: string;
  finish_reason: string;

  constructor(base64: string | null, url: string, seed: string, finish_reason: string) {
    this.base64 = base64;
    this.url = url;
    this.seed = seed;
    this.finish_reason = finish_reason;
  }
}

export class JobProgressStatus {
  job_id: number;
  job_type: string;
  job_stage: string;
  job_progress: number;
  job_status: string;
  job_step_preview: string;
  job_result: JobResult[];

  constructor(job_id: number, job_type: string, job_stage: string, job_progress: number, job_status: string, job_step_preview: string, job_result: JobResult[]) {
    this.job_id = job_id;
    this.job_type = job_type;
    this.job_stage = job_stage;
    this.job_progress = job_progress;
    this.job_status = job_status;
    this.job_step_preview = job_step_preview;
    this.job_result = job_result;
  }
}

