import { Injectable } from '@nestjs/common';

export interface Resource {
  id: number;
  name: string;
  quantity: number;
  description: string;
  createdAt: Date;
  status: string;
}

@Injectable()
export class ResourcesService {
  private resources: Resource[] = [];

  createResource(data: { name: string; quantity: number; description: string }) {
    const { name, quantity, description } = data;

    const existingResource = this.resources.find(resource => resource.name === name);
    if (existingResource) {
      throw new Error('Resource name must be unique');
    }

    const newResource: Resource = {
      id: this.resources.length + 1,
      name,
      quantity,
      description,
      createdAt: new Date(),
      status: 'active',
    };

    this.resources.push(newResource);

    return newResource;
  }

  findAll() {
    return this.resources;
  }

  findOne(id: number) {
    const resource = this.resources.find(resource => resource.id === id);
    if (!resource) {
      throw new Error('Resource not found');
    }
    return resource;
  }

  update(id: number, data: Partial<Resource>) {
    const resourceIndex = this.resources.findIndex(resource => resource.id === id);
    if (resourceIndex === -1) {
      throw new Error('Resource not found');
    }

    this.resources[resourceIndex] = { ...this.resources[resourceIndex], ...data };
    return this.resources[resourceIndex];
  }

  delete(id: number) {
    const resourceIndex = this.resources.findIndex(resource => resource.id === id);
    if (resourceIndex === -1) {
      throw new Error('Resource not found');
    }

    const deletedResource = this.resources.splice(resourceIndex, 1);
    return deletedResource[0];
  }
}