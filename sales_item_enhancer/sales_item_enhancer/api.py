@frappe.whitelist()
def get_items_for_kanban():
    items = frappe.db.sql("""
        SELECT 
            item_code, item_name, image, standard_rate as price
        FROM 
            `tabItem`
        WHERE 
            is_sales_item = 1
        LIMIT 50
    """, as_dict=True)

    return items
