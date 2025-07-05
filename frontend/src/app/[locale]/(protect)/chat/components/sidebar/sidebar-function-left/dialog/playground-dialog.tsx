import { useState } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Slider } from '@/registry/new-york-v4/ui/slider';
import { Label } from '@/registry/new-york-v4/ui/label';
import { ScrollArea } from '@/registry/new-york-v4/ui/scroll-area';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Loader2 } from 'lucide-react';

export function PlaygroundDialog() {
    const [prompt, setPrompt] = useState('');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1000);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResponse('Đây là phản hồi mẫu từ API. Bạn có thể điều chỉnh các thông số bên trái để thay đổi kết quả.');
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Left panel - Settings */}
            <div className="col-span-3 border-r p-4 space-y-6">
                <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Slider
                        value={[temperature]}
                        onValueChange={([value]) => setTemperature(value)}
                        min={0}
                        max={1}
                        step={0.1}
                    />
                    <div className="text-sm text-muted-foreground">{temperature}</div>
                </div>
                <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Slider
                        value={[maxTokens]}
                        onValueChange={([value]) => setMaxTokens(value)}
                        min={100}
                        max={4000}
                        step={100}
                    />
                    <div className="text-sm text-muted-foreground">{maxTokens}</div>
                </div>
            </div>

            {/* Right panel - Chat */}
            <div className="col-span-9 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    {response && (
                        <Card className="p-4 mb-4">
                            <div className="prose dark:prose-invert max-w-none">
                                {response}
                            </div>
                        </Card>
                    )}
                </ScrollArea>
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Nhập prompt của bạn..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Gửi'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
