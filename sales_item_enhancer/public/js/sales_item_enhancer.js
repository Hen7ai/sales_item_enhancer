frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
        frm.add_custom_button(__('Add Multiple Items'), function() {
            open_item_kanban_view(frm);
        });
    }
});

function open_item_kanban_view(frm) {
    frappe.call({
        method: 'sales_item_enhancer.api.get_items_for_kanban',
        callback: function(response) {
            const items = response.message;
            // 创建一个基于看板的选择界面
            let dialog = new frappe.ui.Dialog({
                title: __("Select Items"),
                fields: [
                    {
                        fieldname: 'item_kanban',
                        fieldtype: 'HTML'
                    }
                ]
            });

            const kanban_html = generate_kanban_view(items);
            dialog.fields_dict.item_kanban.$wrapper.html(kanban_html);

            dialog.show();

            // 绑定事件以将选择的商品添加到表单
            bind_item_selection_events(frm, dialog);
        }
    });
}

function generate_kanban_view(items) {
    // 根据商品生成看板视图的 HTML 代码
    let kanban_html = '<div class="kanban-container">';
    items.forEach(item => {
        kanban_html += `
            <div class="kanban-card" data-item-code="${item.item_code}">
                <img src="${item.image}" alt="${item.item_name}" class="item-image"/>
                <div class="item-info">
                    <h4>${item.item_name}</h4>
                    <p>Price: ${item.price}</p>
                </div>
                <input type="number" min="1" placeholder="Qty" class="item-qty"/>
            </div>
        `;
    });
    kanban_html += '</div>';
    return kanban_html;
}

function bind_item_selection_events(frm, dialog) {
    // 绑定点击事件，处理添加选定的商品和数量到销售订单
    dialog.$wrapper.on('click', '.kanban-card', function() {
        const item_code = $(this).data('item-code');
        const qty = $(this).find('.item-qty').val();

        if (qty > 0) {
            frm.add_child('items', {
                item_code: item_code,
                qty: qty
            });
            frm.refresh_field('items');
            dialog.hide();
        }
    });
}
