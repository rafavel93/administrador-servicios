const socket = io();

// CREACIÓN
socket.on('service:created', (service) => {
    const notice = document.getElementById('socket-notice');

    if (notice) {
        notice.textContent = `Nuevo servicio agregado: ${service.name}`;
    }

    addServiceCard('services-list', service);

    if (service.available) {
        addServiceCard('availability-list', service);
    }
});

// EDICIÓN
socket.on('service:updated', (service) => {
    const notice = document.getElementById('socket-notice');

    if (notice) {
        notice.textContent = `Servicio actualizado: ${service.name}`;
    }

    removeServiceCard('services-list', service._id);
    removeServiceCard('availability-list', service._id);

    addServiceCard('services-list', service);

    if (service.available) {
        addServiceCard('availability-list', service);
    }
});

// ELIMINACIÓN
socket.on('service:deleted', (service) => {
    const notice = document.getElementById('socket-notice');

    if (notice) {
        notice.textContent = `Servicio eliminado: ${service.name}`;
    }

    removeServiceCard('services-list', service._id);
    removeServiceCard('availability-list', service._id);
});

// AGREGAR TARJETA
function addServiceCard(containerId, service) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    if (
        service._id &&
        container.querySelector(`[data-service-id="${service._id}"]`)
    ) {
        return;
    }

    const emptyMessage = container.querySelector('.empty-message');

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const card = document.createElement('article');
    card.className = 'service-card';

    if (service._id) {
        card.dataset.serviceId = service._id;
    }

    const title = document.createElement('h3');
    title.textContent = service.name ?? '';
    card.appendChild(title);

    const description = document.createElement('p');
    description.className = 'service-description';
    description.textContent = service.description ?? '';
    card.appendChild(description);

    const details = document.createElement('dl');

    addDetail(details, 'Duración', `${service.duration} minutos`);
    addDetail(details, 'Precio', `R$ ${service.price}`);
    addDetail(details, 'Categoría', service.category ?? '');

    const statusRow = document.createElement('div');
    const statusLabel = document.createElement('dt');
    statusLabel.textContent = 'Disponibilidad';

    const statusValue = document.createElement('dd');
    const status = document.createElement('span');

    status.className = service.available
        ? 'status status-available'
        : 'status status-unavailable';

    status.textContent = service.available
        ? 'Disponible'
        : 'No disponible';

    statusValue.appendChild(status);
    statusRow.append(statusLabel, statusValue);
    details.appendChild(statusRow);
    card.appendChild(details);

    container.prepend(card);
}

// ELIMINAR TARJETA
function removeServiceCard(containerId, serviceId) {
    const container = document.getElementById(containerId);

    if (!container || !serviceId) {
        return;
    }

    const card = container.querySelector(
        `[data-service-id="${serviceId}"]`
    );

    if (card) {
        card.remove();
    }

    updateEmptyMessage(container);
}

// ACTUALIZAR MENSAJE DE LISTA VACÍA
function updateEmptyMessage(container) {
    const hasCards = container.querySelector('.service-card');

    if (!hasCards && !container.querySelector('.empty-message')) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';

        emptyMessage.textContent =
            container.id === 'availability-list'
                ? 'No hay servicios disponibles.'
                : 'No hay servicios registrados.';

        container.appendChild(emptyMessage);
    }
}

// AGREGAR DETALLES
function addDetail(container, label, value) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    container.appendChild(row);
}
