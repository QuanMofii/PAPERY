import { useState } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Switch } from '@/registry/new-york-v4/ui/switch';
import { Slider } from '@/registry/new-york-v4/ui/slider';
import { Loader2 } from 'lucide-react';

export function SettingsDialog() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        autoSave: true,
        notifications: true,
        darkMode: false,
        fontSize: 14,
        maxHistoryItems: 50
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 p-4 h-[85vh] overflow-x-scroll">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Cài đặt hệ thống</h2>
                <p className="text-sm text-muted-foreground">
                    Tùy chỉnh các cài đặt cho trải nghiệm tốt nhất
                </p>
            </div>

            <div className="space-y-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Tự động lưu</Label>
                            <p className="text-sm text-muted-foreground">
                                Tự động lưu các thay đổi của bạn
                            </p>
                        </div>
                        <Switch
                            checked={settings.autoSave}
                            onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                        />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Thông báo</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận thông báo về các cập nhật và hoạt động
                            </p>
                        </div>
                        <Switch
                            checked={settings.notifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                        />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Chế độ tối</Label>
                            <p className="text-sm text-muted-foreground">
                                Chuyển đổi giao diện sang chế độ tối
                            </p>
                        </div>
                        <Switch
                            checked={settings.darkMode}
                            onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                        />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cỡ chữ</Label>
                            <p className="text-sm text-muted-foreground">
                                Điều chỉnh kích thước chữ cho dễ đọc
                            </p>
                        </div>
                        <Slider
                            value={[settings.fontSize]}
                            onValueChange={([value]) => setSettings({ ...settings, fontSize: value })}
                            min={12}
                            max={20}
                            step={1}
                        />
                        <div className="text-sm text-muted-foreground">
                            {settings.fontSize}px
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Số lượng lịch sử tối đa</Label>
                            <p className="text-sm text-muted-foreground">
                                Số lượng cuộc trò chuyện được lưu trong lịch sử
                            </p>
                        </div>
                        <Slider
                            value={[settings.maxHistoryItems]}
                            onValueChange={([value]) => setSettings({ ...settings, maxHistoryItems: value })}
                            min={10}
                            max={100}
                            step={10}
                        />
                        <div className="text-sm text-muted-foreground">
                            {settings.maxHistoryItems} cuộc trò chuyện
                        </div>
                    </div>
                </Card>
            </div>

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
