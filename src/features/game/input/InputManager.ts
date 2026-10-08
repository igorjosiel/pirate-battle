export class InputManager {
    private keys = new Set<string>();
    private previousKeys = new Set<string>();

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

    public wasPressed(key: string) {
        const normalizedKey = key.toLowerCase();

        return (
            this.keys.has(normalizedKey) &&
            !this.previousKeys.has(normalizedKey)
        );
    }

    public update() {
        this.previousKeys = new Set(this.keys);
    }
}
