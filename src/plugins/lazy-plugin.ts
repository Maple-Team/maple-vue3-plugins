import { DirectiveBinding, Plugin } from "vue";

interface LazyOptions {
  loading: string;
  error: string;
}
/**
 * 图片懒加载插件
 * 1. 图片的管理
 * 2. 可视区的判断
 */
enum State {
  loading,
  loaded,
  error,
}
export class ImageManager {
  el: HTMLImageElement;
  src: string;
  state: State;
  loading: string;
  error: string;
  cache: Set<string>;
  constructor(options: {
    el: HTMLImageElement;
    src: string;
    loading: string;
    error: string;
    cache: Set<string>;
  }) {
    this.el = options.el;
    this.src = options.src;
    this.state = State.loading;
    this.loading = options.loading;
    this.error = options.error;
    this.cache = options.cache;
    this.render(this.loading);
  }
  render(loading?: string) {
    this.el.setAttribute("src", loading || this.src);
  }
  load(next?: Function) {
    if (this.state > State.loading) {
      return;
    }
    if (this.cache.has(this.src)) {
      this.state = State.loaded;
      this.render(this.src);
      return;
    }
    console.log("render");
    this.renderSrc(next);
  }
  renderSrc(next?: Function) {
    loadImage(this.src)
      .then(() => {
        this.state = State.loaded;
        this.render();
        this.cache.add(this.src);
        next && next();
      })
      .catch((e) => {
        this.state = State.error;
        this.render(this.error);
        console.warn(
          `load failed with src image(${this.src}) and the error msg is ${
            e.message || ""
          }`
        );
        next && next();
      });
  }
  update(src: string) {
    const currentSrc = this.src;

    if (currentSrc !== src) {
      debugger;
      this.src = src;
      this.state = State.loading;
      this.load();
    }
  }
}

function loadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      resolve();
      dispose();
    };
    image.onerror = function (e) {
      reject(e);
      dispose();
    };
    if (!src.startsWith("http")) {
      const { protocol, hostname, port } = new URL(import.meta.url);
      image.src = `${protocol}//${hostname}:${port}/${src}`; //TODO 本地图片资源处理
    } else {
      image.src = src;
    }
    function dispose() {
      image.onload = image.onerror = null;
    }
  });
}
const DEFAULT_URL =
  "data:image/png;base64,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";

class Lazy {
  observer: IntersectionObserver | undefined;
  managerQueue: ImageManager[];
  /**
   * 加载时的占位图
   */
  loading: string;
  /**
   * 加载错误时的占位图
   */
  error: string;
  cache: Set<string>;
  constructor(options: { loading: string; error: string }) {
    this.managerQueue = [];
    this.initIntersectionObserver();
    this.loading = options.loading || DEFAULT_URL;
    this.error = options.error || DEFAULT_URL;
    this.cache = new Set<string>();
  }
  add(el: HTMLImageElement, binding: DirectiveBinding) {
    const src = binding.value;
    const manager = new ImageManager({
      el,
      src,
      loading: this.loading,
      error: this.error,
      cache: this.cache,
    });
    this.managerQueue.push(manager);
    this.observer?.observe(el);
  }
  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const manager = this.managerQueue.find((manager) => {
              return manager.el === entry.target;
            });
            if (manager) {
              if (manager.state === State.loaded) {
                this.removeManager(manager);
                return;
              }
              manager.load();
            }
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      }
    );
  }
  removeManager(manager: ImageManager) {
    const index = this.managerQueue.indexOf(manager);
    if (index > -1) {
      this.managerQueue.splice(index, 1);
    }
    if (this.observer) {
      this.observer.unobserve(manager.el);
    }
  }
  update(el: HTMLImageElement, binding: DirectiveBinding) {
    debugger
    const src = binding.value;
    const manager = this.managerQueue.find((manager) => {
      return manager.el === el;
    });
    if (manager) {
      manager.update(src);
    }
  }
  remove(el: HTMLImageElement) {
    const manager = this.managerQueue.find((manager) => {
      manager.el === el;
    });
    if (manager) {
      this.removeManager(manager);
    }
  }
}
const LazyPlugin: Plugin = {
  install(app, options: LazyOptions) {
    const lazy = new Lazy(options);
    app.directive("lazy", {
      mounted: (lazy.add as Function).bind(lazy),
      updated: (lazy.update as Function).bind(lazy),
      unmounted: (lazy.remove as Function).bind(lazy),
    });
  },
};

export default LazyPlugin;
