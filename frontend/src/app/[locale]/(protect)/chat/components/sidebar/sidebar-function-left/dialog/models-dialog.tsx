import { useState } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Label } from '@/registry/new-york-v4/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/new-york-v4/ui/radio-group';
import { Loader2 } from 'lucide-react';

const AVAILABLE_MODELS = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Model mạnh nhất cho các tác vụ phức tạp',
        maxTokens: 8192,
        price: '0.03/1K tokens'
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Model nhanh và hiệu quả cho hầu hết các tác vụ',
        maxTokens: 4096,
        price: '0.002/1K tokens'
    },
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Model mới nhất từ Anthropic với khả năng phân tích sâu',
        maxTokens: 100000,
        price: '0.015/1K tokens'
    }
];

export function ModelsDialog() {
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 p-4">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Chọn Model</h2>
                <p className="text-sm text-muted-foreground">
                    Chọn model AI phù hợp với nhu cầu của bạn
                </p>
            </div>

            <RadioGroup
                value={selectedModel}
                onValueChange={setSelectedModel}
                className="grid gap-4"
            >
                {AVAILABLE_MODELS.map((model) => (
                    <Card key={model.id} className="p-4">
                        <div className="flex items-center space-x-4">
                            <RadioGroupItem value={model.id} id={model.id} />
                            <div className="flex-1">
                                <Label htmlFor={model.id} className="text-base font-medium">
                                    {model.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {model.description}
                                </p>
                                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                                    <span>Max tokens: {model.maxTokens.toLocaleString()}</span>
                                    <span>Giá: {model.price}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </RadioGroup>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        'Lưu cài đặt'
                    )}
                </Button>
            </div>
        </div>
    );
}
