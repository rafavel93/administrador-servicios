const socket = io();

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

function addServiceCard(containerId, service) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    // Evitar duplicar un servicio que ya esté en la vista.
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

function addDetail(container, label, value) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    container.appendChild(row);
}
