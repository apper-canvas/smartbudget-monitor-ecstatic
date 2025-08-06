import { toast } from "react-toastify";

class BudgetService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'budget_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "monthlyLimit_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "spent_c" } },
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
        console.error("Error fetching budgets:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching budgets:", error.message);
        toast.error("Failed to load budgets");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "monthlyLimit_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "spent_c" } },
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
        console.error(`Error fetching budget with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching budget:", error.message);
        toast.error("Failed to load budget");
      }
      return null;
    }
  }

  async create(budgetData) {
    try {
      const params = {
        records: [{
          Name: budgetData.category || budgetData.Name,
          category_c: budgetData.category || budgetData.category_c,
          monthlyLimit_c: parseFloat(budgetData.monthlyLimit || budgetData.monthlyLimit_c),
          month_c: budgetData.month || budgetData.month_c,
          spent_c: parseFloat(budgetData.spent || budgetData.spent_c || 0),
          Tags: budgetData.Tags || ""
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
          console.error(`Failed to create budget ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating budget:", error.message);
        toast.error("Failed to create budget");
      }
      return null;
    }
  }

  async update(id, budgetData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (budgetData.category !== undefined || budgetData.category_c !== undefined) {
        updateData.category_c = budgetData.category || budgetData.category_c;
        updateData.Name = budgetData.category || budgetData.category_c;
      }
      if (budgetData.monthlyLimit !== undefined || budgetData.monthlyLimit_c !== undefined) {
        updateData.monthlyLimit_c = parseFloat(budgetData.monthlyLimit || budgetData.monthlyLimit_c);
      }
      if (budgetData.month !== undefined || budgetData.month_c !== undefined) {
        updateData.month_c = budgetData.month || budgetData.month_c;
      }
      if (budgetData.spent !== undefined || budgetData.spent_c !== undefined) {
        updateData.spent_c = parseFloat(budgetData.spent || budgetData.spent_c);
      }
      if (budgetData.Tags !== undefined) {
        updateData.Tags = budgetData.Tags;
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
          console.error(`Failed to update budget ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating budget:", error.message);
        toast.error("Failed to update budget");
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
          console.error(`Failed to delete budget ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting budget:", error.message);
        toast.error("Failed to delete budget");
      }
      return false;
    }
  }

  async updateSpentAmount(category, month, amount) {
    try {
      // First, find the budget record
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "month_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo", 
            Values: [category]
          },
          {
            FieldName: "month_c",
            Operator: "EqualTo",
            Values: [month]
          }
        ]
      };

      const fetchResponse = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!fetchResponse.success || !fetchResponse.data || fetchResponse.data.length === 0) {
        return null;
      }

      const budgetRecord = fetchResponse.data[0];
      
      // Update the spent amount
      const updateParams = {
        records: [{
          Id: budgetRecord.Id,
          spent_c: parseFloat(amount)
        }]
      };

      const updateResponse = await this.apperClient.updateRecord(this.tableName, updateParams);
      
      if (!updateResponse.success) {
        console.error(updateResponse.message);
        return null;
      }

      return updateResponse.results?.[0]?.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating budget spent amount:", error?.response?.data?.message);
      } else {
        console.error("Error updating budget spent amount:", error.message);
      }
      return null;
    }
  }
}

export const budgetService = new BudgetService();