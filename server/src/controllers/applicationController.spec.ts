const mockingoose = require("mockingoose");
import mongoose from 'mongoose';
import { getAllApplications, getApplicationById, createApplication, updateApplication, deleteApplication } from "./applicationController";
import Application, { IApplication } from "../models/Application";

// Mock Application model methods
mockingoose(Application);

const mockUserId = new mongoose.Types.ObjectId();

// Define mock application data
const mockApplicationData1: Partial<IApplication> = {
    company: "Company 1",
    role: "Superrole 1",
    url: "Url",
    location: "Los Angeles, CA",
    salary: 150000,
    stage: new mongoose.Types.ObjectId(),
    rank: 4,
    dateCreated: new Date(),
    dateModified: new Date(),
    dateApplied: new Date(),
    user: mockUserId,
};
const mockApplicationData2: Partial<IApplication> = {
    company: "Company 2",
    role: "Superrole 2",
    url: "Url",
    location: "Los Angeles, CA",
    salary: 150000,
    stage: new mongoose.Types.ObjectId(),
    rank: 4,
    dateCreated: new Date(),
    dateModified: new Date(),
    dateApplied: new Date(),
    user: mockUserId,
};

describe("applicationController", () => {
    describe("getAllApplications", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks between tests if necessary
        });

        it("should fetch all applications for a user", async () => {
            // Mock data to simulate applications fetched from the database
            const mockedApplications: Partial<IApplication>[] = [
                mockApplicationData1,
                mockApplicationData2
            ];

            // Mock the Application.find() method to return mockedApplications
            mockingoose(Application).toReturn(mockedApplications, "find");

            // Call getAllApplications function with mocked userId
            const result = await getAllApplications(mockUserId.toString());

            // Assert the result matches the mocked applications structure
            expect(result).toHaveLength(mockedApplications.length);
            result.forEach((app, index) => {
                expect(app._id).toBeDefined();
                expect(app.company).toEqual(mockedApplications[index].company);
                expect(app.role).toEqual(mockedApplications[index].role);
                expect(app.salary).toEqual(mockedApplications[index].salary);
                expect(app.dateApplied).toEqual(mockedApplications[index].dateApplied);
            });
        });

        it("should throw an error when fetching applications fails", async () => {
            const userId = "mockedUserId";

            // Mock Application.find() to throw an error
            mockingoose(Application).toReturn(new Error("Database error"), "find");

            // Call getAllApplications function and expect it to throw an error
            await expect(getAllApplications(userId)).rejects.toThrowError(
                "Failed to fetch applications"
            );
        });
    });

    describe("getApplicationById", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks between tests if necessary
        });

        it("should fetch application by ID for authorized user", async () => {
            // Mock Application.findById() to return mockApplicationData
            mockingoose(Application).toReturn(mockApplicationData1, "findOne");

            // Call getApplicationById function with mocked applicationId and userId
            const result = await getApplicationById(mockApplicationData1.id, mockUserId.toString());

            // Assert the result matches the mocked application structure
            expect(result).toMatchObject({
                _id: expect.any(Object),
                company: mockApplicationData1.company,
                role: mockApplicationData1.role,
                url: mockApplicationData1.url,
                location: mockApplicationData1.location,
                salary: mockApplicationData1.salary
            });
        });

        it("should throw an error when application is not found", async () => {
            // Mock Application.findById() to return null
            mockingoose(Application).toReturn(null, "findOne");
        
            // Assert that getApplicationById function throws the expected error
            await expect(getApplicationById(mockApplicationData1.id, mockUserId.toString()))
                .rejects.toThrow("Failed to fetch application");
        });        

        it("should throw an error when user is not authorized", async () => {
            // Modify mockApplicationData to have a different user ID
            const unauthorizedApplicationData = { ...mockApplicationData1, user: new mongoose.Types.ObjectId() };

            // Mock Application.findById() to return unauthorizedApplicationData
            mockingoose(Application).toReturn(unauthorizedApplicationData, "findOne");

            // Call getApplicationById function with mocked applicationId and userId
            await expect(getApplicationById(mockApplicationData1.id, mockUserId.toString()))
                .rejects.toThrow("Failed to fetch application");
        });

        it("should throw an error when fetching application fails", async () => {
            // Mock Application.findById() to throw an error
            mockingoose(Application).toReturn(new Error("Database error"), "findOne");

            // Call getApplicationById function with mocked applicationId and userId
            await expect(getApplicationById(mockApplicationData1.id, mockUserId.toString()))
                .rejects.toThrow("Failed to fetch application");
        });
    });

    describe("createApplication", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks between tests if necessary
        });

        it("should create a new application", async () => {
            // Mock the Application.save() method to return the created application
            mockingoose(Application).toReturn(mockApplicationData1, "save");

            // Call createApplication function with mockApplicationData
            const result = await createApplication(mockApplicationData1);

            // Assert that the result matches the mockApplicationData structure
            expect(result).toMatchObject(mockApplicationData1);
        });

        it("should throw an error when application creation fails", async () => {
            // Mock Application.save() to throw an error
            mockingoose(Application).toReturn(new Error("Database error"), "save");

            // Call createApplication function and expect it to throw an error
            await expect(createApplication(mockApplicationData1)).rejects.toThrow(
                "Failed to create application"
            );
        });
    });

    describe("updateApplication", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks between tests if necessary
        });

        it("should update an existing application", async () => {
            const mockApplicationId = mockApplicationData1.id;
            const mockUserId = mockApplicationData1.user?.toString() || "";

            const updatedFields: Partial<IApplication> = {
                company: "Updated Company",
                role: "Updated Role",
                location: "Updated Location",
                salary: 100000,
            };

            // Mock Application.findById() to return the mockExistingApplication
            mockingoose(Application).toReturn(mockApplicationData1, "findOne");

            // Mock Application.save() to return the updated application
            mockingoose(Application).toReturn({ ...mockApplicationData1, ...updatedFields }, "save");

            // Call updateApplication function with mockApplicationId, updatedFields, and mockUserId
            const result = await updateApplication(mockApplicationId, updatedFields, mockUserId);

            // Assert that the result matches the updatedFields
            expect(result).toMatchObject(updatedFields);
        });

        it("should throw an error when application is not found", async () => {
            const mockApplicationId = mockApplicationData1.id;
            const mockUserId = mockApplicationData1.user?.toString() || "";

            // Mock Application.findById() to return null (application not found)
            mockingoose(Application).toReturn(null, "findOne");

            // Call updateApplication function and expect it to throw an error
            await expect(updateApplication(mockApplicationId, {}, mockUserId)).rejects.toThrowError(
                "Failed to update application"
            );
        });

        it("should throw an error when user is not authorized", async () => {
            const mockApplicationId = mockApplicationData1.id;
            const mockUserId = "wrongUserId";

            // Mock Application.findById() to return the mockApplicationData1
            mockingoose(Application).toReturn(mockApplicationData1, "findOne");

            // Call updateApplication function and expect it to throw an error
            await expect(updateApplication(mockApplicationId, {}, mockUserId)).rejects.toThrowError(
                "Failed to update application"
            );
        });
    });

    describe("deleteApplication", () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks between tests if necessary
        });

        it("should delete an existing application", async () => {
            const mockApplicationId = "mockApplicationId";
            const mockUserId = mockApplicationData1.user?.toString() || "";

           // Mock Application.findById() to return the mockExistingApplication
           mockingoose(Application).toReturn(mockApplicationData1, "findOne");

           // Mock Application.findByIdAndDelete() to return a resolved promise
           mockingoose(Application).toReturn(null, "findOneAndDelete");

           // Call deleteApplication function with mockApplicationId and mockUserId
           const result = await deleteApplication(mockApplicationId, mockUserId);

           // Assert that the result is the success message
           expect(result).toBe('Application removed');
        });

        it("should throw an error when application is not found", async () => {
            const mockApplicationId = mockApplicationData1.id;
            const mockUserId = mockApplicationData1.user?.toString() || "";

            // Mock Application.findById() to return null (application not found)
            mockingoose(Application).toReturn(null, "findOne");

            // Call deleteApplication function and expect it to throw an error
            await expect(deleteApplication(mockApplicationId, mockUserId)).rejects.toThrowError(
                "Failed to delete application"
            );
        });

        it("should throw an error when user is not authorized", async () => {
            const mockApplicationId = mockApplicationData1.id;
            const mockUserId = "wrongUserId";

            // Mock Application.findById() to return the mockExistingApplication
            mockingoose(Application).toReturn(mockApplicationData1, "findOne");

            // Call deleteApplication function and expect it to throw an error
            await expect(deleteApplication(mockApplicationId, mockUserId)).rejects.toThrow(
                "Failed to delete application"
            );
        });
    });
});
