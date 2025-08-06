import { toast } from "react-toastify";

class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
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
        console.error("Error fetching transactions:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error.message);
        toast.error("Failed to load transactions");
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
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
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
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching transaction:", error.message);
        toast.error("Failed to load transaction");
      }
      return null;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: transactionData.description || transactionData.Name,
          type_c: transactionData.type || transactionData.type_c,
          amount_c: parseFloat(transactionData.amount || transactionData.amount_c),
          category_c: transactionData.category || transactionData.category_c,
          description_c: transactionData.description || transactionData.description_c,
          date_c: transactionData.date || transactionData.date_c,
          createdAt_c: new Date().toISOString(),
          Tags: transactionData.Tags || ""
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
          console.error(`Failed to create transaction ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error.message);
        toast.error("Failed to create transaction");
      }
      return null;
    }
  }

  async update(id, transactionData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (transactionData.description !== undefined || transactionData.Name !== undefined) {
        updateData.Name = transactionData.description || transactionData.Name;
      }
      if (transactionData.type !== undefined || transactionData.type_c !== undefined) {
        updateData.type_c = transactionData.type || transactionData.type_c;
      }
      if (transactionData.amount !== undefined || transactionData.amount_c !== undefined) {
        updateData.amount_c = parseFloat(transactionData.amount || transactionData.amount_c);
      }
      if (transactionData.category !== undefined || transactionData.category_c !== undefined) {
        updateData.category_c = transactionData.category || transactionData.category_c;
      }
      if (transactionData.description !== undefined || transactionData.description_c !== undefined) {
        updateData.description_c = transactionData.description || transactionData.description_c;
      }
      if (transactionData.date !== undefined || transactionData.date_c !== undefined) {
        updateData.date_c = transactionData.date || transactionData.date_c;
      }
      if (transactionData.Tags !== undefined) {
        updateData.Tags = transactionData.Tags;
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
          console.error(`Failed to update transaction ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error.message);
        toast.error("Failed to update transaction");
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
          console.error(`Failed to delete transaction ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error.message);
        toast.error("Failed to delete transaction");
      }
      return false;
    }
  }
}

export const transactionService = new TransactionService();