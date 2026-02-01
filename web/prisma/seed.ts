import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
    { id: 'cat_1', name: 'Computadoras', slug: 'computadoras', icon: 'Monitor' },
    { id: 'cat_2', name: 'Laptops', slug: 'laptops', icon: 'Laptop' },
    { id: 'cat_3', name: 'Componentes', slug: 'componentes', icon: 'Cpu' },
    { id: 'cat_4', name: 'Periféricos', slug: 'perifericos', icon: 'Mouse' },
    { id: 'cat_5', name: 'Monitores', slug: 'monitores', icon: 'Monitor' },
    { id: 'cat_6', name: 'Almacenamiento', slug: 'almacenamiento', icon: 'HardDrive' },
]

const brands = [
    { id: 'brand_1', name: 'ASUS', slug: 'asus', logo: '/brands/asus.png' },
    { id: 'brand_2', name: 'MSI', slug: 'msi', logo: '/brands/msi.png' },
    { id: 'brand_3', name: 'Logitech', slug: 'logitech', logo: '/brands/logitech.png' },
    { id: 'brand_4', name: 'Corsair', slug: 'corsair', logo: '/brands/corsair.png' },
    { id: 'brand_5', name: 'Razer', slug: 'razer', logo: '/brands/razer.png' },
    { id: 'brand_6', name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.png' },
]

const products = [
    {
        id: 'prod_1',
        name: 'Laptop Gaming ASUS ROG Strix G16',
        slug: 'asus-rog-strix-g16',
        description: 'Potente laptop gaming con procesador Intel Core i9 y gráfica NVIDIA RTX 4070.',
        price: 1899.99,
        comparePrice: 2100.00,
        stock: 15,
        images: ['/products/laptop-rog.png'],
        specs: { processor: 'i9-13980HX', ram: '32GB DDR5', storage: '1TB SSD', gpu: 'RTX 4070' },
        isNew: true,
        isFeatured: true,
        categoryId: 'cat_2',
        brandId: 'brand_1',
        rating: 4.8,
        reviewCount: 124,
    },
    {
        id: 'prod_2',
        name: 'Monitor Gaming Samsung Odyssey G7',
        slug: 'samsung-odyssey-g7',
        description: 'Monitor curvo de 32 pulgadas QHD con 240Hz de tasa de refresco.',
        price: 699.99,
        comparePrice: 799.99,
        stock: 8,
        images: ['/products/monitor-odyssey.png'],
        specs: { size: '32"', resolution: '2560x1440', refreshRate: '240Hz', panel: 'VA' },
        isNew: false,
        isFeatured: true,
        categoryId: 'cat_5',
        brandId: 'brand_6',
        rating: 4.7,
        reviewCount: 89,
    },
    {
        id: 'prod_3',
        name: 'Mouse Logitech G Pro X Superlight',
        slug: 'logitech-g-pro-x-superlight',
        description: 'El mouse gaming más ligero y preciso para esports.',
        price: 149.99,
        comparePrice: null,
        stock: 45,
        images: ['/products/mouse-logitech.png'],
        specs: { weight: '63g', dpi: '25600', connectivity: 'Wireless' },
        isNew: false,
        isFeatured: false,
        categoryId: 'cat_4',
        brandId: 'brand_3',
        rating: 4.9,
        reviewCount: 312,
    },
    {
        id: 'prod_4',
        name: 'Tarjeta Gráfica MSI GeForce RTX 4080 Gaming X Trio',
        slug: 'msi-rtx-4080-gaming-x-trio',
        description: 'Gráfica de alto rendimiento para gaming en 4K y renderizado.',
        price: 1299.00,
        comparePrice: 1350.00,
        stock: 5,
        images: ['/products/gpu-msi.png'],
        specs: { vram: '16GB GDDR6X', boostClock: '2610 MHz', cores: '9728' },
        isNew: true,
        isFeatured: true,
        categoryId: 'cat_3',
        brandId: 'brand_2',
        rating: 4.8,
        reviewCount: 45,
    },
]

async function main() {
    console.log('Iniciando seed...')

    // Limpiar base de datos
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.brand.deleteMany()
    await prisma.category.deleteMany()

    // Crear categorías
    for (const cat of categories) {
        await prisma.category.create({ data: cat })
    }

    // Crear marcas
    for (const brand of brands) {
        await prisma.brand.create({ data: brand })
    }

    // Crear productos
    for (const prod of products) {
        await prisma.product.create({ data: prod })
    }

    console.log('Seed completado exitosamente.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
