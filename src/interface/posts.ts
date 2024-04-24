declare global {
    interface TypeFormPosts {
        userId: number;
        id: number | null;
        title: string;
        body: string;
    }
}

export type { TypeFormPosts }
