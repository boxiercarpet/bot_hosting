var logger = {
    log: (module, ...msg) => {
        console.log(`[\x1b[33m${module}\x1b[0m]`, ...msg);
    }
};

export default logger