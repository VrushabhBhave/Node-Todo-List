const { stdin, stdout, exit } = require("process");
const readline = require("readline");
const fs = require("node:fs").promises;
const path = require("node:path");
const { writeFile } = require("node:fs");

const filepath = path.join(__dirname, "task.txt");

const getInput = (question) => {
    const r1 = readline.createInterface({
        input: stdin,
        output: stdout,
    });

    return new Promise ((res) => {
        r1.question(question, (answer) => {
            res(answer);
            r1.close();
        });
    });
};

const addTask = async() => {
    try{
        const task = await getInput("Type your task ==>");
        try{
            //check file exist or not
            await fs.access(filepath);
            const fileContent = await fs.readFile(filepath, "utf-8");
            if(task === ""){
                console.log("Plz Enter Some Task!");
                return;
            }
            if(fileContent.trim() === ""){
                await fs.writeFile(filepath, task)
            }else{
                await fs.appendFile(filepath, `\n${task}`)
            }
        }catch(err){
            if(task === ""){
                console.log("Plz Enter Some Task!");
            }else{
                await fs.writeFile(filepath, task);
                console.log("Task added successfully!");
            }
        }
    }catch(error){
        console.error("Error adding task: ", error);
    }
}

const viewFile = async() => {
    try{
        const data = await fs.readFile(filepath, "utf-8");
        return data.split("\n");
    }catch(err){
        console.error("Error reading file: ", err);
        return [];
    }
}

const markComplete = async() => {
    try{
        const data = await viewFile();
        if(data.length === 0){
            console.log("No tasks available to mark as completed.");
            return;
        }
        if(data.length === 1 && data[0].trim() === ""){
            console.log("\n No Tasks Added Yet!\n");
            return;
        }
        console.log("\nYour tasks are: ");
        data.map((line, idx) => {
            console.log(`${idx + 1} => ${line}`);
        })
        console.log("\n");
        let idx = Number(await getInput("Choose which task you want mark as complete"));
        if(isNaN(idx) || idx < 1 || idx > data.length){
            console.log("Invalid task number. Please enter a valid number: ");
            return;
        }
        data[idx - 1] = `**${data[idx - 1]}**`
        await fs.writeFile(filepath, data.join("\n"));
        console.log("Task marked as completed.");
    }catch(err){
        console.error("Error marking task", err);
    }
}

const deleteTask = async() => {
    try{
        const data = await viewFile();
        if(data.length === 0){
            console.log("No tasks available to delete.");
            return;
        }
        if(data.length === 1 && data[0].trim() === ""){
            console.log("\n No tasks available to delete.!\n");
            return;
        }
        console.log("\nYour tasks are: ");
        data.map((line, idx) => {
            console.log(`${idx + 1} => ${line}`);
        })
        console.log("\n");
        let idx = Number(await getInput("Choose which task you want to delete: "));
        if(isNaN(idx) || idx < 1 || idx > data.length){
            console.log("Invalid task number. Please enter a valid number");
            return;
        }
        data.splice(idx - 1, 1);
        fs.writeFile(filepath, data.join("\n"));
        console.log("Deleted data succesfully!");
    }catch(err){
        console.log("Error delete task", err);
    }
}

async function main() {
    while(true){
        console.log("1. Add a new task.");
        console.log("2. View a list of task.");
        console.log("3. Mark a task as complete.");
        console.log("4. Remove a task.");
        console.log("5. Exit.");

        const choice = await getInput("Enter Your Choice? ");
        
        switch(choice) {
            case "1":
                await addTask();
                break;
            case "2":
                const data = await viewFile();
                if(data.length === 1 && data[0].trim() === ""){
                    console.log("\n No Tasks Added Yet!\n");
                    return;
                }
                if(data.length > 0){
                    console.log("\nYour tasks are: ");
                    data.map((line, idx) => {
                        console.log(`${idx + 1} => ${line}`);
                    })
                    console.log("\n");
                }else{
                    console.log("\n No Tasks Added Yet!\n");
                }
                break;
            case "3":
                await markComplete();
                break;
            case "4":
                await deleteTask();
                break;
            case "5":
                exit();
                break;
            default:
                console.log("\nEnter a valid number\n");
        }
    }
}

main();