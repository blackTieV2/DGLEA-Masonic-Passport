import type { TemplateItemRepository } from '../application/ports';
import type { TemplateItemReference } from '../domain/contracts';

export class InMemoryTemplateItemRepository implements TemplateItemRepository {
  private readonly items = new Map<string, TemplateItemReference>();

  constructor(seedItems: Record<string, TemplateItemReference> = {}) {
    for (const [id, value] of Object.entries(seedItems)) {
      this.items.set(id, value);
    }
  }

  async getById(templateItemId: string): Promise<TemplateItemReference | null> {
    return this.items.get(templateItemId) ?? null;
  }
}
