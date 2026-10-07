export class InputManager {
    private keys = new Set<string>();

    constructor() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.keys.add(event.key.toLowerCase());
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keys.delete(event.key.toLowerCase());
    };

    isPressed(key: string) {
        return this.keys.has(key);
    }

    destroy() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }
}
