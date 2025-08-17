import { supabase } from '../../lib/supabase';

export const categoryService = {
    async getAllCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getCategoryById(id: number) {
        const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getTestsByCategory(categoryName: string) {
        const { data, error } = await supabase
            .from('tests')
            .select('*')
            .eq('category', categoryName)
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
};
