import { ref, computed, watchEffect } from "vue";

type SnackBarType = "success" | "error";

interface SnackbarMessage {
    message: string;
    type: SnackBarType;
}

const queue = ref<SnackbarMessage[]>([]);
const currentMessage = ref<SnackbarMessage | null>(null);

let timeout: ReturnType<typeof setTimeout> | null = null;

export const useSnackbar = () => {
    const showSnackbar = (message: string, type: SnackBarType = "success") => {
        queue.value.push({ message, type });
    };

    watchEffect(() => {
        if (!currentMessage.value && queue.value.length > 0) {
            currentMessage.value = queue.value.shift()!;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                currentMessage.value = null;
            }, 3000);
        }
    });

    return {
        showSnackbar,
        currentMessage: computed(() => currentMessage.value),
    };
};
