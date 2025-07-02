'use client';

import { useState } from 'react';

import { http } from '@/lib/http';

export default async function useCreate(
    path: string,
    data: { name: string; description: string },
    config = {
        withCredentials: true
    }
) {
    const response = await http.post(`/${path}`, data, config);

    return response;
}
