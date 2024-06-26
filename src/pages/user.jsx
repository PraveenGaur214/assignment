
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    InputGroup,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function User() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const history = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        customerName: '',
        price: '',
        lastModified: new Date(),
        name: '',
        category: '',
        characteristics: '',
        features: '',
        brand: '',
        skus: [{ sku_id: '', price: '',  maxPrice:'', amount:'', unit:'', quantity: '' }],
    });
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setIsEdit(false);
        setIsViewMode(false);
        setFormData({
            id: '',
            customerName: '',
            price: '',
            lastModified: new Date(),
            name: '',
            category: '',
            characteristics: '',
            features: '',
            brand: '',
            skus: [{ sku_id: '', price: '',maxPrice:'', amount:'', unit:'', quantity: '' }],
        });
    };

    const handleLogout = () => {
        history('/');
        console.log("Logged out");
    };

    const handleSaveOrder = () => {
        if (isEdit) {
            const updatedOrders = [...orders];
            updatedOrders[currentEditIndex] = formData;
            setOrders(updatedOrders);
            setIsEdit(false);
            setCurrentEditIndex(null);
        } else {
            setOrders(prevOrders => [...prevOrders, formData]);
        }
        setIsOpen(false);
        setFormData({
            id: '',
            customerName: '',
            price: '',
            lastModified: new Date(),
            name: '',
            category: '',
            characteristics: '',
            features: '',
            brand: '',
            skus: [{ sku_id: '', price: '',maxPrice:'', amount:'', unit:'', quantity: '' }],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSkuInputChange = (e, index, field) => {
        const { value } = e.target;
        const updatedSkus = formData.skus.map((sku, i) => (
            i === index ? { ...sku, [field]: value } : sku
        ));
        setFormData(prevState => ({
            ...prevState,
            skus: updatedSkus
        }));
    };

    const handleAddSku = () => {
        setFormData(prevState => ({
            ...prevState,
            skus: [...prevState.skus, { sku_id: '', price: '', maxPrice:'',amount:'',unit:'', quantity: '' }]
        }));
    };

    const handleEditOrder = (index) => {
        const order = orders[index];
        setFormData({
            ...order,
            lastModified: new Date(order.lastModified) // Ensure the date is in the correct format
        });
        setIsEdit(true);
        setCurrentEditIndex(index);
        setIsOpen(true);
    };

    const [isViewMode, setIsViewMode] = useState(false);
    const handleViewOrder = (index) => {
        setFormData(orders[index]);
        setIsViewMode(true); // Set view mode to true
        setIsOpen(true);
    };
    // const handleViewOrder = (index) => {
    //     setFormData(orders[index]);
    //     setIsOpen(true);
    // };

    
    const handleCompleteOrder = (index) => {
        const completedOrder = orders[index];
        const newCompletedOrder = {
            customer_id: completedOrder.id,
            items: completedOrder.skus.map(sku => ({
                sku_id: sku.sku_id,
                price: sku.price,
                quantity: sku.quantity
            })),
            paid: true,
            invoice_no: `Invoice - ${Math.floor(Math.random() * 1000000)}`,
            invoice_date: new Date().toLocaleDateString(),
        };
        setCompletedOrders(prevCompletedOrders => [...prevCompletedOrders, newCompletedOrder]);
        setOrders(prevOrders => prevOrders.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h1>Hello</h1>
            <Box pos="absolute" w="5" left="2%" top="0%" zIndex={2}>
            <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
</Box>
<Box pos="absolute" w="10%" right="10%" zIndex={2}>
<Button colorScheme='blue' onClick={handleOpenModal}>+ Add Order</Button>
</Box>
            
                    
            <Tabs variant='enclosed'>
                <TabList>
                    <Tab>Active Orders</Tab>
                    <Tab>Completed Orders</Tab>
                    
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Customer Name</Th>
                                    <Th>Price</Th>
                                    <Th>Last Modified</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orders.map((order, index) => (
                                    <Tr key={index}>
                                        <Td>{order.id}</Td>
                                        <Td>{order.customerName}</Td>
                                        <Td>{order.price}</Td>
                                        <Td>{new Date(order.lastModified).toLocaleDateString()}</Td> {/* Ensure date is displayed as string */}
                                        <Td>
                                            <Button colorScheme="yellow" onClick={() => handleEditOrder(index)}>Edit</Button>
                                            <Button colorScheme="blue" onClick={() => handleViewOrder(index)}>View</Button>
                                            <Button colorScheme="green" onClick={() => handleCompleteOrder(index)}>Complete</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>
                    <TabPanel>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Customer ID</Th>
                                    <Th>Invoice No</Th>
                                    <Th>Invoice Date</Th>
                                    <Th>Items</Th>
                                    <Th>Paid</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {completedOrders.map((order, index) => (
                                    <Tr key={index}>
                                        <Td>{order.customer_id}</Td>
                                        <Td>{order.invoice_no}</Td>
                                        <Td>{order.invoice_date}</Td>
                                        <Td>
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex}>
                                                    SKU ID: {item.sku_id}, Price: {item.price}, Quantity: {item.quantity}
                                                </div>
                                            ))}
                                        </Td>
                                        <Td>{order.paid ? "Yes" : "No"}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal size={"xl"} isOpen={isOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEdit ? "Edit Order" : "Add Order"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>ID</FormLabel>
                            <Input name="id" placeholder="Enter ID" value={formData.id} onChange={handleInputChange} isDisabled={isViewMode} />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Customer Name</FormLabel>
                            <Input name="customerName" placeholder="Enter customer name" value={formData.customerName} onChange={handleInputChange} isDisabled={isViewMode} />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Price</FormLabel>
                            <Input name="price" placeholder="Enter price" value={formData.price} onChange={handleInputChange} isDisabled={isViewMode} />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Last Modified</FormLabel>
                            <DatePicker
                                selected={formData.lastModified}
                                onChange={(date) => setFormData(prevState => ({ ...prevState, lastModified: date }))}
                                dateFormat="MM/dd/yyyy"
                                isDisabled={isViewMode}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" placeholder="Enter name" value={formData.name} onChange={handleInputChange} isDisabled={isViewMode}/>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Category</FormLabel>
                            <Input name="category" placeholder="Enter category" value={formData.category} onChange={handleInputChange} isDisabled={isViewMode}/>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Characteristics</FormLabel>
                            <Textarea name="characteristics" placeholder="Enter characteristics" value={formData.characteristics} onChange={handleInputChange} isDisabled={isViewMode}/>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Features</FormLabel>
                            <Textarea name="features" placeholder="Enter features" value={formData.features} onChange={handleInputChange} isDisabled={isViewMode}/>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Brand</FormLabel>
                            <Input name="brand" placeholder="Enter brand" value={formData.brand} onChange={handleInputChange} isDisabled={isViewMode}/>
                        </FormControl>
                        {formData.skus.map((sku, index) => (
                            <FormControl key={index} mb={4}>
                                <FormLabel>SKU {index + 1}</FormLabel>
                                <InputGroup>
                                    <Input name={`sku_id_${index}`} placeholder="SKU ID" value={sku.sku_id} onChange={(e) => handleSkuInputChange(e, index, 'sku_id')} isDisabled={isViewMode}/>
                                    <Input name={`sku_price_${index}`} placeholder="Price" value={sku.price} onChange={(e) => handleSkuInputChange(e, index, 'price')} isDisabled={isViewMode}/>
                                    {/* <Input name={`sku_quantity_${index}`} placeholder="Selling Price" value={sku.sellingPrice} onChange={(e) => handleSkuInputChange(e, index, 'quantity')} /> */}
                                    <Input name={`sku_maxPrice_${index}`} placeholder="Max Retail Price" value={sku.maxPrice} onChange={(e) => handleSkuInputChange(e, index, 'maxPrice')} isDisabled={isViewMode}/>
                                    <Input name={`sku_amount_${index}`} placeholder="Amount" value={sku.amount} onChange={(e) => handleSkuInputChange(e, index, 'amount')} isDisabled={isViewMode} />
                                    <Input name={`sku_unit_${index}`} placeholder="unit" value={sku.unit} onChange={(e) => handleSkuInputChange(e, index, 'unit')} isDisabled={isViewMode}/>
                                    <Input name={`sku_quantity_${index}`} placeholder="Quantity" value={sku.quantity} onChange={(e) => handleSkuInputChange(e, index, 'quantity')} isDisabled={isViewMode}/>
                                </InputGroup>
                            </FormControl>
                        ))}
                        <Button colorScheme="blue" onClick={handleAddSku}>Add SKU</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button colorScheme="green" onClick={handleSaveOrder}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default User;

