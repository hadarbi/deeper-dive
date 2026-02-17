import { Publisher, Page, PaginatedResponse } from '../../../shared/types/publisher.js';
export declare const publisherRepository: {
    findAll(search?: string, isActive?: boolean, page?: number, limit?: number): Promise<PaginatedResponse<Publisher>>;
    findByPublisherId(publisherId: string): Promise<Publisher | null>;
    findPagesByPublisherIdSync(publisherId: string): Page[];
    create(publisher: Publisher): Promise<Publisher>;
    update(publisherId: string, data: Partial<Publisher>): Promise<Publisher | null>;
    delete(publisherId: string): Promise<boolean>;
};
//# sourceMappingURL=publisherRepository.d.ts.map