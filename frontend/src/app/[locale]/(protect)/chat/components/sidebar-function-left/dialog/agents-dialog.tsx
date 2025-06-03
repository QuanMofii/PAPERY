import { useState } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const MOCK_AGENTS = [
    {
        id: '1',
        name: 'Research Assistant',
        description: 'Agent hỗ trợ nghiên cứu và phân tích',
        status: 'active'
    },
    {
        id: '2',
        name: 'Code Helper',
        description: 'Agent hỗ trợ lập trình và debug',
        status: 'inactive'
    }
];

export function AgentsDialog() {
    const [agents, setAgents] = useState(MOCK_AGENTS);
    const [isLoading, setIsLoading] = useState(false);
    const [newAgent, setNewAgent] = useState({
        name: '',
        description: ''
    });

    const handleCreateAgent = async () => {
        setIsLoading(true);
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAgents([
            ...agents,
            {
                id: String(agents.length + 1),
                ...newAgent,
                status: 'active'
            }
        ]);
        setNewAgent({ name: '', description: '' });
        setIsLoading(false);
    };

    const handleDeleteAgent = async (id: string) => {
        setIsLoading(true);
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAgents(agents.filter(agent => agent.id !== id));
        setIsLoading(false);
    };

    return (
        <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Danh sách Agent</TabsTrigger>
                <TabsTrigger value="create">Tạo Agent mới</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
                {agents.map((agent) => (
                    <Card key={agent.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{agent.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {agent.description}
                                </p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    agent.status === 'active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                }`}>
                                    {agent.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAgent(agent.id)}
                                disabled={isLoading}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên Agent</Label>
                    <Input
                        id="name"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                        placeholder="Nhập tên agent..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                        id="description"
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        placeholder="Nhập mô tả agent..."
                    />
                </div>
                <Button onClick={handleCreateAgent} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo Agent
                        </>
                    )}
                </Button>
            </TabsContent>
        </Tabs>
    );
}
