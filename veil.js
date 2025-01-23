/**
 * Wraps a target object with provided presets object
 * and when trying to access the provided presets methods on the veil object
 * it passes them throuhg, until the veil object is pierced, meaning the use methods
 * not listed in the provided preset object
 */
class Veil {
  #pierced;
  #target;
  #presets;
  #targetProto;

  constructor(
    target,
    presets,
  ) {
    this.#pierced = false;
    this.#target = target;
    this.#presets = new Map(Object.entries(presets));
    /**
     * Accept the target object methods only (no)
     */
    this.#targetProto = Object.getPrototypeOf(this.#target);
    Object.getOwnPropertyNames(this.#targetProto).forEach(
      methodName => {
        if (typeof this.#target[methodName] === 'function' && methodName !== 'constructor') {
          this[methodName] = this.#useTargetMethod(methodName);
        }
      }
    );
    
  };
  
  #useTargetMethod(methodName) {
    this.#ignoreSettersAndGetter(methodName);
    return (...args) => {
      return this.#acceptPresetMethodOrPierce(methodName, args);;
    };
  };
  
  /**
   * Forbid setters and getters in the target object
   */
  #ignoreSettersAndGetter(methodName) {
    var methodDescriptor = Object.getOwnPropertyDescriptor(this.#targetProto, methodName);
    if (methodDescriptor.get || methodDescriptor.set)
      throw new Error(`Method "${methodName}" is either setter or getter, which is forbidden.`);
    return;
  };
  
  #acceptPresetMethodOrPierce(methodName, ...args) {
    if (!this.#pierced && this.#presets.has(methodName)) {
      return this.#presets.get(methodName);
    }
    if (!this.#pierced) {
      this.#pierce();
    }
    return this.#applyTargetMethod(methodName, args)
  };
  
  #applyTargetMethod(methodName, ...args) {
    var targetMethod = this.#target[methodName];
    return targetMethod.apply(this.#target, args);
  };

  #pierce() {
    this.#pierced = true;
  };
};

export default Veil;
