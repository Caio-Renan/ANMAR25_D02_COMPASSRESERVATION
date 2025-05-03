import { ConflictException, Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';

export interface Resource {
  id: number;
  name: string;
  quantity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

@Injectable()
export class ResourcesService {
  private resources: Resource[] = [];

  createResource(data: { name: string; quantity: number; description: string }) {
    const { name, quantity, description } = data;

    const existingResource = this.resources.find(resource => resource.name === name);
    if (existingResource) {
      throw new ConflictException('resource already registered');
    }

    const newResource: Resource = {
      id: this.resources.length + 1,
      name,
      quantity,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    this.resources.push(newResource);

    return newResource;
  } 
 
  findAll(page: number, limit: number, name?: string, status?: string) {
    let filteredResources = this.resources;
  
    if (name) {
      filteredResources = filteredResources.filter(resource =>
        resource.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
  
    if (status) {
      filteredResources = filteredResources.filter(resource => resource.status === status);
    }
  
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);
  
    return {
      data: paginatedResources,
      total: filteredResources.length,
      page,
      limit,
    };
  }  

  findOne(id: number) {
    const resource = this.resources.find(resource => resource.id === id);
    if (!resource) {
      throw new ConflictException('Resource not found');
    }
    return resource;
  }

  update(id: number, data: Partial<Resource>) {
    const resourceIndex = this.resources.findIndex(resource => resource.id === id);
    if (resourceIndex === -1) {
      throw new ConflictException('Resource not found');
    }

    this.resources[resourceIndex] = { 
      ...this.resources[resourceIndex],
      ...data,
      updatedAt: new Date() 
    };
    
    return this.resources[resourceIndex];
  }

  delete(id: number) {
    const resourceIndex = this.resources.findIndex(resource => resource.id === id);
    if (resourceIndex === -1) {
      throw new ConflictException('Resource not found');
    }

    const deletedResource = this.resources.splice(resourceIndex, 1);
    return deletedResource[0];
  }
}