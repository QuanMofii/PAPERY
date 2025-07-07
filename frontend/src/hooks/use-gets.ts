import { useEffect, useState } from 'react';

import { http } from '@/lib/http';
import { useListChatStore } from '@/store/chat-list.store';
import { useListProjectStore } from '@/store/project-list.store';

import useNotification from './use-notification';

export default function useGets(
    path: string,
    query = {},
    store: 'project' | 'chat',
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    config = { withCredentials: true }
) {
    const { projects, setProjects } = useListProjectStore();
    const { chats, setChats } = useListChatStore();

    const parseData = (data: []) => {
        const newData: Array<any> = [];

        data.map((item: any) => {
            if (store === 'project') {
                const newProject = {
                    id: item.uuid,
                    name: item.name,
                    description: item.description,
                    createAt: ''
                };
                newData.push(newProject);
            }
            if (store === 'chat') {
                const newChat = {
                    id: item.uuid,
                    title: item.title,
                    favorite: false
                };

                newData.push(newChat);
            }
        });

        return newData;
    };

    useEffect(() => {
        const fetchList = async () => {
            const queryString = new URLSearchParams(query).toString(); //chuyen query thanh string
            const res = await http.get(`/${path}/?${queryString}`, config);
            if (store === 'project') {
                if (projects.length === 0 && res.success) {
                    const newProjects = parseData(res.data);
                    setProjects(newProjects);
                    useNotification('projects', res, 'fetch');
                }
            }
            if (store === 'chat') {
                if (chats.length === 0 && res.success) {
                    const newChats = parseData(res.data);
                    setChats(newChats);
                    useNotification('chats', res, 'fetch');
                }
            }
            setLoading(false);
        };
        fetchList();
    }, [path, JSON.stringify(query), JSON.stringify(config)]);
}
