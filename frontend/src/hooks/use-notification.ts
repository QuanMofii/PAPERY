import { toast } from 'sonner';

export default function useNotification(type: string, response: any, purpose: string) {
    toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
        description: response.success
            ? `${purpose} ${type}ed successfully`
            : response.error?.message || `Failed to ${type} ${purpose}`,
        duration: 2000
    });
}
