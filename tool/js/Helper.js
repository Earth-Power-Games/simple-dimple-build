class Helper {
  /**
   * 
   * @param {string} name 
   * @param {string} content 
   */
  static downloadTextAsFile(name, content) {
    const a = document.createElement("a");
    // ! `data:text/plain;charset=utf-8, ${encodeURIComponent(content)}`
    a.href = URL.createObjectURL(new Blob([content]));
    a.download = name;
    a.click();
  }

  /**
   * 
   * @param {File} file 
   * @returns 
   */
  static toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * 
   * @param {number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns 
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 
   * @param {number} value 
   * @returns 
   */
  static roundValue(value) {
    return Math.round(value * 1000) / 1000;
  }
}