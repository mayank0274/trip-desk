import { createSupabaseServerClient } from "@/supabase/server";

export async function requireRole(allowedRoles: string[]) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
        return null;
    }

    const { data: membership, error } = await supabase
        .from("team")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !membership) {
        return null;
    }

    if (!allowedRoles.includes(membership.role)) {
        return null;
    }

    return {
        user,
        role: membership.role,
    };
}