/**
 * Classroom POS Logic
 * Designed for primary school roleplay.
 */

// 1. Setup Menu Items
const MENU_ITEMS = [
    { id: 1, name: 'Burger', price: 5.00, icon: '🍔' },
    { id: 2, name: 'Fries', price: 3.00, icon: '🍟' },
    { id: 3, name: 'Nuggets', price: 4.00, icon: '🍗' },
    { id: 4, name: 'Drink', price: 2.00, icon: '🥤' },
    { id: 5, name: 'Ice Cream', price: 2.50, icon: '🍦' },
    { id: 6, name: 'Apple', price: 1.00, icon: '🍎' },
    { id: 7, name: 'Hot Dog', price: 4.50, icon: '🌭' },
    { id: 8, name: 'Pizza', price: 3.50, icon: '🍕' }
];

let currentOrder = [];
let total = 0;

// 2. DOM Elements
const menuGrid = document.getElementById('menu-grid');
const orderList = document.getElementById('order-list');
const totalDisplay = document.getElementById('total-display');
const checkoutBtn = document.getElementById('checkout-btn');
const clearBtn = document.getElementById('clear-btn');
const modal = document.getElementById('payment-modal');
const cashierSound = document.getElementById('cashier-sound');

// 3. Initialize Menu
function initMenu() {
    MENU_ITEMS.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'menu-item';
        btn.innerHTML = `
            <span class="item-icon">${item.icon}</span>
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
        `;
        btn.onclick = () => addToOrder(item);
        menuGrid.appendChild(btn);
    });
}

// 4. Order Operations
function addToOrder(item) {
    const existing = currentOrder.find(i => i.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        currentOrder.push({ ...item, qty: 1 });
    }
    renderOrder();
}

function removeItem(id) {
    const itemIndex = currentOrder.findIndex(i => i.id === id);
    if (itemIndex > -1) {
        if (currentOrder[itemIndex].qty > 1) {
            currentOrder[itemIndex].qty--;
        } else {
            currentOrder.splice(itemIndex, 1);
        }
    }
    renderOrder();
}

function renderOrder() {
    if (currentOrder.length === 0) {
        orderList.innerHTML = '<div class="empty-msg">Order is empty</div>';
        total = 0;
        checkoutBtn.disabled = true;
    } else {
        orderList.innerHTML = '';
        total = 0;
        currentOrder.forEach(item => {
            const lineTotal = item.price * item.qty;
            total += lineTotal;
            
            const row = document.createElement('div');
            row.className = 'order-row';
            row.innerHTML = `
                <div class="order-info">
                    <button class="delete-btn" onclick="removeItem(${item.id})">✕</button>
                    <span>${item.qty}x ${item.name}</span>
                </div>
                <span>$${lineTotal.toFixed(2)}</span>
            `;
            orderList.appendChild(row);
        });
        checkoutBtn.disabled = false;
    }
    totalDisplay.innerText = `$${total.toFixed(2)}`;
}

// 5. Checkout Logic
checkoutBtn.onclick = () => {
    modal.style.display = 'flex';
    resetModalViews();
};

function resetModalViews() {
    document.getElementById('payment-step-1').classList.remove('hidden');
    document.getElementById('payment-cash').classList.add('hidden');
    document.getElementById('payment-card').classList.add('hidden');
    document.getElementById('payment-success').classList.add('hidden');
}

function handlePaymentChoice(type) {
    document.getElementById('payment-step-1').classList.add('hidden');
    if (type === 'cash') {
        document.getElementById('payment-cash').classList.remove('hidden');
        document.getElementById('cash-total-due').innerText = `$${total.toFixed(2)}`;
    } else {
        document.getElementById('payment-card').classList.remove('hidden');
    }
}

document.getElementById('confirm-pay-btn').onclick = () => {
    const btn = document.getElementById('confirm-pay-btn');
    const barContainer = document.getElementById('progress-bar-container');
    const bar = document.getElementById('progress-bar');
    
    btn.disabled = true;
    barContainer.classList.remove('hidden');
    setTimeout(() => bar.style.width = '100%', 10); // Tiny delay to trigger CSS transition

    // Simulate cashier processing
    setTimeout(() => {
        cashierSound.play();
        document.getElementById('payment-cash').classList.add('hidden');
        document.getElementById('payment-success').classList.remove('hidden');
        
        // Final Auto-reset
        setTimeout(resetSystem, 3500);
    }, 2100);
};

function resetSystem() {
    currentOrder = [];
    renderOrder();
    closeModal();
    // Reset UI states
    document.getElementById('confirm-pay-btn').disabled = false;
    document.getElementById('progress-bar').style.width = '0%';
}

function closeModal() {
    modal.style.display = 'none';
}

clearBtn.onclick = () => {
    if(confirm("Clear the entire order?")) {
        currentOrder = [];
        renderOrder();
    }
};

// 6. Classroom Utilities
document.getElementById('fullscreen-btn').onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

// Start the app
initMenu();