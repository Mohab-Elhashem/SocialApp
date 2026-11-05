import type { notificationProps } from "@/types/notifications.types";
import api from "./axios";


export async function getNotifications(page:number , limit: number){
    const {data} = await api.get<notificationProps>('/notifications',
        {
            params:{
                page,
                limit
            }
        }
    )
    return data
}


export async function getUnreadCount(){
    const {data} = await api.get<notificationProps>('/notifications/unread-count')
    return data
}

export async function markAsRead(notificationId: string) {
    const { data } = await api.patch(`/notifications/${notificationId}/read`)
    return data;
}

export async function markAllAsRead() {
    const { data } = await api.patch('/notifications/read-all')
    return data;
}