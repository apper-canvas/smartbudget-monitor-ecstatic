import { toast } from "react-toastify";

class GoalService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'goal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "targetAmount_c" } },
          { field: { Name: "currentAmount_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "deadline_c", sorttype: "ASC" }
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
        console.error("Error fetching goals:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching goals:", error.message);
        toast.error("Failed to load goals");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "targetAmount_c" } },
          { field: { Name: "currentAmount_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "createdAt_c" } },
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
        console.error(`Error fetching goal with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching goal:", error.message);
        toast.error("Failed to load goal");
      }
      return null;
    }
  }

  async create(goalData) {
    try {
      const params = {
        records: [{
          Name: goalData.name || goalData.Name,
          targetAmount_c: parseFloat(goalData.targetAmount || goalData.targetAmount_c),
          currentAmount_c: parseFloat(goalData.currentAmount || goalData.currentAmount_c),
          deadline_c: goalData.deadline || goalData.deadline_c,
          createdAt_c: new Date().toISOString(),
          Tags: goalData.Tags || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create goal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating goal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating goal:", error.message);
        toast.error("Failed to create goal");
      }
      return null;
    }
  }

  async update(id, goalData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (goalData.name !== undefined || goalData.Name !== undefined) {
        updateData.Name = goalData.name || goalData.Name;
      }
      if (goalData.targetAmount !== undefined || goalData.targetAmount_c !== undefined) {
        updateData.targetAmount_c = parseFloat(goalData.targetAmount || goalData.targetAmount_c);
      }
      if (goalData.currentAmount !== undefined || goalData.currentAmount_c !== undefined) {
        updateData.currentAmount_c = parseFloat(goalData.currentAmount || goalData.currentAmount_c);
      }
      if (goalData.deadline !== undefined || goalData.deadline_c !== undefined) {
        updateData.deadline_c = goalData.deadline || goalData.deadline_c;
      }
      if (goalData.Tags !== undefined) {
        updateData.Tags = goalData.Tags;
      }

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update goal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating goal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating goal:", error.message);
        toast.error("Failed to update goal");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete goal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting goal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting goal:", error.message);
        toast.error("Failed to delete goal");
      }
      return false;
    }
  }
}

export const goalService = new GoalService();