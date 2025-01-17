/**
 * Wraps a target object with provided presets object
 * and when trying to access the provided presets methods on the veil object
 * it passes them throuhg, until the veil object is pierced, meaning the use methods
 * not listed in the provided preset object
 */
class Veil {
  constructor(
    target,
    presets,
    pierced,
  ) {
    this.pierced = false;
    this.target = target;
    this.presets = new Map(Object.entries(presets));

    Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.target)
    ).slice(1).forEach(
      methodName => {
        if (typeof this.target[methodName] === 'function') {
          this[methodName] = this.wrapMethod(methodName);
        }
      }
    );
  };

  wrapMethod(methodName) {
    return (...args) => {
      if (!this.pierced && this.presets.has(methodName)) {
        return this.presets.get(methodName);
      }
      if (!this.pierced) {
        this.pierce();
      }
      const targetMethod = this.target[methodName];
      if (typeof targetMethod === 'function') {
        return targetMethod.apply(this.target, args);
      }
      throw new Error(`Method "${String(methodName)}" does not exist on the target object.`);
    };
  }

  pierce() {
    this.pierced = true;
  }
};

export default Veil;
