import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await this.delay();
    return [...this.budgets];
  }

  async getById(id) {
    await this.delay();
    const budget = this.budgets.find(b => b.Id === parseInt(id));
    if (!budget) {
      throw new Error("Budget not found");
    }
    return { ...budget };
  }

  async create(budget) {
    await this.delay();
    const newBudget = {
      ...budget,
      Id: Math.max(...this.budgets.map(b => b.Id)) + 1,
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    this.budgets[index] = { ...this.budgets[index], ...updates };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    this.budgets.splice(index, 1);
    return true;
  }

  async updateSpentAmount(category, month, amount) {
    await this.delay();
    const budget = this.budgets.find(b => b.category === category && b.month === month);
    if (budget) {
      budget.spent = amount;
      return { ...budget };
    }
    return null;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const budgetService = new BudgetService();