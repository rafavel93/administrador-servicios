import fs from 'fs/promises';
import path from 'path';

class BookingsDAO {
    constructor() {
        this.filePath = path.join(
            process.cwd(),
            'src',
            'data',
            'bookings.json'
        );
    }

    async getAll() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const bookings = await this.getAll();

        return bookings.find(
            booking => booking.id === Number(id)
        ) || null;
    }

    async create(booking) {
        const bookings = await this.getAll();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(item => item.id)) + 1
            : 1;

        const newBooking = {
            ...booking,
            id: newId
        };

        bookings.push(newBooking);

        await fs.writeFile(
            this.filePath,
            JSON.stringify(bookings, null, 2)
        );

        return newBooking;
    }

    async update(id, updatedBooking) {
        const bookings = await this.getAll();

        const index = bookings.findIndex(
            booking => booking.id === Number(id)
        );

        if (index === -1) {
            return null;
        }

        bookings[index] = updatedBooking;

        await fs.writeFile(
            this.filePath,
            JSON.stringify(bookings, null, 2)
        );

        return updatedBooking;
    }
}

export default BookingsDAO;
