import { toast } from "react-toastify";

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
        toast.error("Failed to load categories");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching category:", error.message);
        toast.error("Failed to load category");
      }
      return null;
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories by type:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching categories by type:", error.message);
        toast.error("Failed to load categories");
      }
      return [];
    }
  }
}

export const categoryService = new CategoryService();