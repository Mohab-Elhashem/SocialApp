export interface notificationProps {
    success: boolean
    message: string
    data: Data
    meta: Meta
}

export interface Data {
    notifications: Notification[]
}

export interface Notification {
    _id: string
    recipient: Recipient
    actor: Actor
    type: string
    entityType: string
    entityId: string
    isRead: boolean
    createdAt: string
    entity: Entity
}

export interface Recipient {
    _id: string
    name: string
    photo: string
}

export interface Actor {
    _id: string
    name: string
    photo: string
}

export interface Entity {
    _id: string
    unavailable: boolean
}

export interface Meta {
    feedMode: string
    pagination: Pagination
}

export interface Pagination {
    currentPage: number
    limit: number
    total: number
    numberOfPages: number
    nextPage: number
}
