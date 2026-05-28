import q10Roc from '../assets/quizzes/biometrics/q10_roc.png';
import q11Roc from '../assets/quizzes/biometrics/q11_roc.png';
import q13Det from '../assets/quizzes/biometrics/det_q13.png';

export const quizData = {
    oop_midterm: {
        id: 'oop_midterm',
        title: 'Midterm Past Papers',
        titleAr: 'أسئلة سنوات ميد',
        icon: '💻',
        color: '#2196F3',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Given the following code:<br><pre><code class="language-java">public class Item {\n    private int num;\n    public double price;\n    public void show()\n    {     }\n}</code></pre>Which of the following statements is correct inside show()?',
                options: [
                    { id: 'a', textEn: 'System.out.print(num + " " + price );' },
                    { id: 'b', textEn: 'System.out.print(num );' },
                    { id: 'c', textEn: 'System.out.print(price );' },
                    { id: 'd', textEn: 'All of the above (a, b, and c).' },
                    { id: 'e', textEn: 'None of the above' }
                ],
                correctAnswer: 'd',
                marks: 1.5
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'How would you access a non-static variable from another class in the same package?<br><pre><code class="language-java">public class A {\n    int x = 10;\n}\npublic class B {\n    void display()\n    { // Access x here }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'System.out.println(A.x);' },
                    { id: 'b', textEn: 'A a = new A(); System.out.println(a.x);' },
                    { id: 'c', textEn: 'System.out.println(x);' },
                    { id: 'd', textEn: 'this.x' },
                    { id: 'e', textEn: 'A a = new A(); System.out.println(A.x);' }
                ],
                correctAnswer: 'b',
                marks: 1.5
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'According to the following class:<br><pre><code class="language-java">public class Address {\n    private int num;\n    private static String zcode;\n    public static void post(int t)\n    {    }\n}</code></pre>Which statement is correct inside post method?',
                options: [
                    { id: 'a', textEn: 'System.out.print(num);' },
                    { id: 'b', textEn: 'zcode = t;' },
                    { id: 'c', textEn: 'num = t;' },
                    { id: 'd', textEn: 'System.out.print(zcode + ":" + num);' },
                    { id: 'e', textEn: 'System.out.print(zcode);' }
                ],
                correctAnswer: 'e',
                marks: 1.5
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'According to the following class:<br><pre><code class="language-java">public class Container {\n    private int value;\n    public void setValue(int value)\n    {    }\n}</code></pre>Which of the following statements should be written inside the setter method \'setValue\' to copy parameter value into the instance variable?',
                options: [
                    { id: 'a', textEn: 'value = value;' },
                    { id: 'b', textEn: 'this.value = s;' },
                    { id: 'c', textEn: 'value = s;' },
                    { id: 'd', textEn: 'this.value = value;' },
                    { id: 'e', textEn: 'value = this.value;' }
                ],
                correctAnswer: 'd',
                marks: 1.5
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Given the following class:<br><pre><code class="language-java">public class Motor {\n    private String model;\n    private int price;\n    private double capacity;\n    public Motor(int a) { price=a; capacity=0.0; }\n    public void show() { System.out.print(model + " " + price); }\n}</code></pre>Which statement correctly creates an object of class Motor inside the main method?',
                options: [
                    { id: 'a', textEn: 'Motor m = new Motor(3500);' },
                    { id: 'b', textEn: 'Motor m = new Motor("Toyota",3000);' },
                    { id: 'c', textEn: 'Motor m = new Motor("Toyota",2500,1.6);' },
                    { id: 'd', textEn: 'Motor m = new Motor(2.5);' },
                    { id: 'e', textEn: 'Motor m = new Motor();' }
                ],
                correctAnswer: 'a',
                marks: 1.5
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Read the following code:<br><pre><code class="language-java">public class Square {\n    private double area;\n    static String color;\n}\npublic class Test{\n    public static void main(String[] args){\n        Square s1 = new Square();\n        Square s2 = new Square();\n        // line here\n    }\n}</code></pre>Which of the following is NOT correct to set color to "black" in main?',
                options: [
                    { id: 'a', textEn: 's2.color = "black";' },
                    { id: 'b', textEn: 's1.color = "black";' },
                    { id: 'c', textEn: 'Square.color = "black";' },
                    { id: 'd', textEn: 'color = "black";' },
                    { id: 'e', textEn: 's1.area = 5.0' }
                ],
                correctAnswer: 'd',
                marks: 1.5
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'What is the output after executing the following code:<br><pre><code class="language-java">public class Rectangle {\n private int width;\n int height;\n public void setWidth(int width) { this.width = width; }\n public int getHeight() { return height; }\n public void show() { System.out.print(width); }\n}\npublic class Test {\n public static void main(String[] args) {\n  Rectangle r = new Rectangle();\n  r.height = 4;\n  r.setWidth(r.getHeight() + 3);\n  r.show();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '4' },
                    { id: 'b', textEn: '10' },
                    { id: 'c', textEn: '5' },
                    { id: 'd', textEn: '7' },
                    { id: 'e', textEn: '6' }
                ],
                correctAnswer: 'd',
                marks: 1.5
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Given the following classes:<br><pre><code class="language-java">public class Counter {\n private int count;\n public void setCount(int count) { this.count = count; }\n public int getCount() { return count; }\n}\npublic class Test {\n public static void main(String[] args) {\n  Counter c = new Counter();\n  c.setCount(3);\n  // line 2\n }\n}</code></pre>Which of the following statements could be written in line 2 inside the main to increase count by one?',
                options: [
                    { id: 'a', textEn: 'c.getCount();' },
                    { id: 'b', textEn: 'count++;' },
                    { id: 'c', textEn: 'c.count++;' },
                    { id: 'd', textEn: 'c.setCount(c.getCount() + 1);' },
                    { id: 'e', textEn: 'c.getCount(c.setCount() + 1);' }
                ],
                correctAnswer: 'd',
                marks: 1.5
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'What is the output after executing the following code:<br><pre><code class="language-java">public class Wheel {\n int radius;\n public Wheel(int r) { radius=r; }\n public Wheel() { radius=4; }\n public void show() { System.out.print(radius); }\n}\npublic class Test{\n public static void main(String[] args){\n  Wheel w = new Wheel();\n  w.show();\n  w.radius = 9;\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '4' },
                    { id: 'b', textEn: '9' },
                    { id: 'c', textEn: '0' },
                    { id: 'd', textEn: '5' },
                    { id: 'e', textEn: 'null' }
                ],
                correctAnswer: 'a',
                marks: 1.5
            },
            {
                id: 11,
                type: 'mcq',
                questionEn: 'According to the following code:<br><pre><code class="language-java">public class Point {\n private int x;\n public int y;\n public void display()\n {    }\n}\npublic class Test {\n public static void main(String[] args){\n  Point p = new Point();\n  p.display();\n }\n}</code></pre>Which is incorrect to write inside display?',
                options: [
                    { id: 'a', textEn: 'System.out.print(x);' },
                    { id: 'b', textEn: 'System.out.print(p.y);' },
                    { id: 'c', textEn: 'x++;' },
                    { id: 'd', textEn: 'System.out.print(y);' },
                    { id: 'e', textEn: 'System.out.print(x + " " + y);' }
                ],
                correctAnswer: 'b',
                marks: 1.5
            },
            {
                id: 12,
                type: 'mcq',
                questionEn: 'Trace the below code then find the output:<br><pre><code class="language-java">public class Phone {\n double price;\n static String brand;\n}\npublic class Test{\n public static void main(String[] args){\n  Phone p1 = new Phone();\n  Phone p2 = new Phone();\n  p1.price = 400;\n  p1.brand = "X1";\n  p2.price = 260;\n  Phone.brand = "Z";\n  System.out.print(p1.brand);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '260' },
                    { id: 'b', textEn: 'null' },
                    { id: 'c', textEn: 'Z' },
                    { id: 'd', textEn: '400' },
                    { id: 'e', textEn: 'X1' }
                ],
                correctAnswer: 'c',
                marks: 1.5
            },
            {
                id: 13,
                type: 'mcq',
                questionEn: 'Find the output of the below code:<br><pre><code class="language-java">public class Box {\n int width;\n Box(int w) { width = w; }\n}\npublic class MyTest {\n public static void main(String[] args) {\n  Box b = new Box();\n  System.out.println(b.width);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '0' },
                    { id: 'b', textEn: 'null' },
                    { id: 'c', textEn: 'Error - no matching constructor' },
                    { id: 'd', textEn: 'false' },
                    { id: 'e', textEn: 'width = 0' }
                ],
                correctAnswer: 'c',
                marks: 1.5
            },
            {
                id: 14,
                type: 'mcq',
                questionEn: 'Given the following code:<br><pre><code class="language-java">public class Mid {\n private void exam() { System.out.print("Done"); }\n public static void main(String[] args) {\n  Mid m = new Mid();\n  // line 3\n }\n}</code></pre>Which statement that could be written in line 3 inside the main to correctly call method \'exam\'?',
                options: [
                    { id: 'a', textEn: 'm.exam();' },
                    { id: 'b', textEn: 'System.out.print(m.exam());' },
                    { id: 'c', textEn: 'exam();' },
                    { id: 'd', textEn: 'm.exam(1);' },
                    { id: 'e', textEn: 'String s = m.exam();' }
                ],
                correctAnswer: 'a',
                marks: 1.5
            },
            {
                id: 15,
                type: 'mcq',
                questionEn: 'Given class \'Student\' with private String \'name\', which of the following is a correct header to set the \'name\'?',
                options: [
                    { id: 'a', textEn: 'public void setName(String na)' },
                    { id: 'b', textEn: 'public void setName(Student na)' },
                    { id: 'c', textEn: 'public void setName(int na)' },
                    { id: 'd', textEn: 'public int setName(int na)' },
                    { id: 'e', textEn: 'public String setName()' }
                ],
                correctAnswer: 'a',
                marks: 1.5
            },
            {
                id: 16,
                type: 'mcq',
                questionEn: 'What will this segment of code print?<br><pre><code class="language-java">for (int i=1; i<=5; i++) {\n if (i==3) continue;\n System.out.print(i + " ");\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '1 2 4 5' },
                    { id: 'b', textEn: '1 2 3 4 5' },
                    { id: 'c', textEn: '1 2' },
                    { id: 'd', textEn: '4 5' },
                    { id: 'e', textEn: 'Compilation Error' }
                ],
                correctAnswer: 'a',
                marks: 1.5
            },
            {
                id: 17,
                type: 'mcq',
                questionEn: 'What is wrong with this code?<br><pre><code class="language-java">public class Student {\n private String name;\n}\npublic class Example {\n public static void main(String[] args) {\n  Student s = new Student();\n  System.out.println(s.name);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'When creating object \'s\' a name must be given' },
                    { id: 'b', textEn: 'Cannot access \'name\' from outside class' },
                    { id: 'c', textEn: 'The variable \'name\' should be defined in main' },
                    { id: 'd', textEn: 'A constructor must be defined' },
                    { id: 'e', textEn: 'The instance variable \'name\' should be static' }
                ],
                correctAnswer: 'b',
                marks: 1.5
            },
            {
                id: 18,
                type: 'mcq',
                questionEn: 'What is the output of the following code:<br><pre><code class="language-java">public class Product {\n int id;\n public Product() { id = 10; }\n}\npublic class Test {\n public static void main(String[] args) {\n  Product p = new Product();\n  System.out.print(p.id);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '0' },
                    { id: 'b', textEn: '10' },
                    { id: 'c', textEn: '1' },
                    { id: 'd', textEn: 'null' },
                    { id: 'e', textEn: 'Error on code' }
                ],
                correctAnswer: 'b',
                marks: 1.5
            },
            {
                id: 19,
                type: 'mcq',
                questionEn: 'Suppose a class \'Employee\' with a private instance variable \'salary\' of type double, choose the correct header to a getter method for the \'salary\'?',
                options: [
                    { id: 'a', textEn: 'public void getSalary()' },
                    { id: 'b', textEn: 'public int getSalary(double s)' },
                    { id: 'c', textEn: 'public double getSalary()' },
                    { id: 'd', textEn: 'public String getSalary(double salary)' },
                    { id: 'e', textEn: 'public void getSalary(double salary)' }
                ],
                correctAnswer: 'c',
                marks: 1.5
            },
            {
                id: 20,
                type: 'mcq',
                questionEn: 'What is the default value of an uninitialized boolean instance variable in Java?',
                options: [
                    { id: 'a', textEn: 'true' },
                    { id: 'b', textEn: 'false' },
                    { id: 'c', textEn: 'null' },
                    { id: 'd', textEn: '0' },
                    { id: 'e', textEn: 'undefined' }
                ],
                correctAnswer: 'b',
                marks: 1.5
            }
        ]
    },
    oop_final: {
        id: 'oop_final',
        title: 'Final Past Papers',
        titleAr: 'أسئلة سنوات فاينل',
        icon: '💻',
        color: '#2196F3',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Read the following code, what is printed?<br><pre><code class="language-java">public static void main(String[] args) {\n try {\n  int[] a = {3, 7, 9};\n  System.out.print(a[2]);\n  System.out.print("M");\n }\n catch (ArrayIndexOutOfBoundsException e)\n  { System.out.print("N"); }\n System.out.print("O");\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '9MO' },
                    { id: 'b', textEn: 'MNO' },
                    { id: 'c', textEn: 'NO' },
                    { id: 'd', textEn: 'Run-time error' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Given the following segment of code:<br><pre><code class="language-java">interface Readable { void read(); }\nclass Document implements Readable {\n private void read() {\n  System.out.println("Reading");\n }\n}</code></pre>Which of the following sentences is correct?',
                options: [
                    { id: 'a', textEn: 'There is an error because the method \'read\' should be static.' },
                    { id: 'b', textEn: 'There is an error because interface methods cannot be implemented.' },
                    { id: 'c', textEn: 'There is an error because the method \'read\' inside class \'Document\' is attempting to assign weaker access privileges.' },
                    { id: 'd', textEn: 'The code is correct.' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Assume the Circle class shown in the below diagram is used from another class in a different package (not a subclass). Which action is NOT allowed?<br><b>Circle</b><br>-radius: double<br>+Circle(r:double)<br>+area(): double<br>-validate(): boolean<br>+scale(factor:double): void',
                options: [
                    { id: 'a', textEn: 'Call area() using a Circle object.' },
                    { id: 'b', textEn: 'Call scale(2.0) using a Circle object.' },
                    { id: 'c', textEn: 'Create a Circle object using Circle(5).' },
                    { id: 'd', textEn: 'Call validate() using a Circle object.' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'Given:<br><pre><code class="language-java">public class A { protected int x; }\npublic class B extends A {\n public void show() { System.out.print(x); }\n}</code></pre>Which statement is true about access to x from B?',
                options: [
                    { id: 'a', textEn: 'B cannot access x because it\'s private.' },
                    { id: 'b', textEn: 'B can access x because it\'s protected and in a subclass.' },
                    { id: 'c', textEn: 'B can access x only if in same package.' },
                    { id: 'd', textEn: 'B can access x only via getter.' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Given the following segment of code:<br><pre><code class="language-java">abstract class Machine {\n abstract public void start();\n}\nclass Engine extends Machine {\n public void stop(int x) {\n  System.out.print(x * 2);\n }\n}</code></pre>Which of the following sentences is correct?',
                options: [
                    { id: 'a', textEn: 'There is an error in the code because you have to override the method \'start\' inside the class \'Engine\'.' },
                    { id: 'b', textEn: 'There is an error because abstract classes cannot have abstract methods.' },
                    { id: 'c', textEn: 'There is an error because class \'Engine\' includes a concrete method named \'stop\'.' },
                    { id: 'd', textEn: 'The code is correct.' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Which condition is correct inside if-statement to count employees with salary < 500?<br><pre><code class="language-java">public class Employee{\n private double salary;\n public double getSalary(){ return salary; }\n}\npublic class Exam {\n public static void main(String[] args) {\n  Employee[] arr = new Employee[20];\n  int count=0;\n  if (........................)\n  count++;\n }\n}\n</code></pre>',
                options: [
                    { id: 'a', textEn: 'arr[i] < 500' },
                    { id: 'b', textEn: 'emp.getSalary() < 500' },
                    { id: 'c', textEn: 'getSalary() < 500' },
                    { id: 'd', textEn: 'arr[i].getSalary() < 500' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Read the following code, What is printed?<br><pre><code class="language-java">class Student {\n private int mark;\n private String subject;\n public Student() { mark=2; subject="PE"; }\n public Student(int m) { mark=m; }\n public int getMark() { return mark; }\n}\npublic class Test {\n public static void main(String[] args) {\n  Student[] grades = new Student[3];\n  grades[0]=new Student();\n  grades[1]=new Student(4);\n  grades[2]=new Student();\n  int sum=0;\n  for(int i=0; i < grades.length ; i++)\n   sum += grades[i].getMark();\n  System.out.print(sum);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '2' },
                    { id: 'b', textEn: '4' },
                    { id: 'c', textEn: '8' },
                    { id: 'd', textEn: '10' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Find the output for the following code?<br><pre><code class="language-java">public class Shape {\n public void draw() { System.out.print("x"); }\n}\npublic class Circle extends Shape {\n public void draw() { System.out.print("y"); }\n}\npublic class Test {\n public static void main(String[] args) {\n  Shape [] shapes = new Shape[4];\n  shapes[0] = new Shape();\n  shapes[1] = new Circle();\n  shapes[2] = new Circle();\n  shapes[3] = new Shape();\n  for (int i = 0 ; i < shapes.length ; i++)\n   shapes[i].draw();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'xxxx' },
                    { id: 'b', textEn: 'yyyy' },
                    { id: 'c', textEn: 'yxxy' },
                    { id: 'd', textEn: 'xyyx' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which of the following correctly creates an array of 11 Player references?<br>public class Player { ... }',
                options: [
                    { id: 'a', textEn: 'Player[ ] fbteam = new ArrayOfObjects[11];' },
                    { id: 'b', textEn: 'Player[ ] fbteam = new name[11];' },
                    { id: 'c', textEn: 'Player fbteam = new Player(11);' },
                    { id: 'd', textEn: 'Player[ ] fbteam = new Player[11];' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'Is the following segment of Java code correct?<br><pre><code class="language-java">public abstract class Table {\n public void run()\n { System.out.println("Hello"); }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'the code is correct.' },
                    { id: 'b', textEn: 'the run method must be abstract' },
                    { id: 'c', textEn: 'class Table must be an interface' },
                    { id: 'd', textEn: 'class Table must contain an instance variable' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 11,
                type: 'mcq',
                questionEn: 'Read the following code, and find the output?<br><pre><code class="language-java">class Fruit {\n Fruit(String name) { System.out.print("F"); }\n}\nclass Apple extends Fruit {\n Apple() { System.out.print("A"); }\n}\nclass myMain {\n public static void main(String[] args) {\n  Apple obj = new Apple();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'Error in code' },
                    { id: 'b', textEn: 'FA' },
                    { id: 'c', textEn: 'AF' },
                    { id: 'd', textEn: 'F' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 12,
                type: 'mcq',
                questionEn: 'Read the following code, and find the output?<br><pre><code class="language-java">class Vehicle {\n Vehicle() { System.out.print("Start"); }\n}\nclass Car extends Vehicle {\n Car() { System.out.print("Drive"); }\n}\nclass Test {\n public static void main(String[] args) {\n  Car c = new Car();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'Drive' },
                    { id: 'b', textEn: 'DriveStart' },
                    { id: 'c', textEn: 'StartDrive' },
                    { id: 'd', textEn: 'Start' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 13,
                type: 'mcq',
                questionEn: 'Find the output of the below code:<br><pre><code class="language-java">public class Box {\n int width;\n Box(int w) { width = w; }\n}\npublic class MyTest {\n public static void main(String[] args) {\n  Box b = new Box();\n  System.out.println(b.width);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '0' },
                    { id: 'b', textEn: 'null' },
                    { id: 'c', textEn: 'Error - no matching constructor' },
                    { id: 'd', textEn: 'false' },
                    { id: 'e', textEn: 'width = 0' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 14,
                type: 'mcq',
                questionEn: 'Read the following code, and find the output?<br><pre><code class="language-java">public class Student { }\npublic class GraduateSt extends Student { }\npublic class Test {\n public static void main(String[] args) {\n  Student s1 = new Student();\n  boolean result = (s1 instanceof GraduateSt);\n  System.out.println(result);\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' },
                    { id: 'c', textEn: '0' },
                    { id: 'd', textEn: 's1' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 15,
                type: 'mcq',
                questionEn: 'Read the following segment of code:<br><pre><code class="language-java">public class Building {\n public final void construct() {\n  System.out.println("Constructing building");\n }\n}\npublic class House extends Building { ... }</code></pre>Which of the following method headers is NOT correct to be declared inside class House?',
                options: [
                    { id: 'a', textEn: 'public void construct()' },
                    { id: 'b', textEn: 'public void construct(String type)' },
                    { id: 'c', textEn: 'public void construct(int rooms, int floors)' },
                    { id: 'd', textEn: 'public void construct(double area)' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 16,
                type: 'mcq',
                questionEn: 'What is the output of the code below?<br><pre><code class="language-java">public static void main(String[] args) {\n double d=1/0;\n try\n { System.out.print(s.charAt(4)); }\n catch (ArithmeticException e)\n { System.out.print("E"); }\n finally\n { System.out.print("F"); }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'aF' },
                    { id: 'b', textEn: 'EF' },
                    { id: 'c', textEn: 'F only' },
                    { id: 'd', textEn: 'Nothing (Runtime Error)' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 17,
                type: 'mcq',
                questionEn: 'Read the following code, and find the output?<br><pre><code class="language-java">interface Calculable { void compute(); }\npublic class Math implements Calculable {\n public void compute() {\n  System.out.println(5 * 7);\n }\n}\npublic class Runner {\n public static void main(String[] args) {\n  Calculable c1 = new Math();\n  c1.compute();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: '0' },
                    { id: 'b', textEn: 'Error in code' },
                    { id: 'c', textEn: '35' },
                    { id: 'd', textEn: '57' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 18,
                type: 'mcq',
                questionEn: 'Read the following code, and find the output?<br><pre><code class="language-java">public class Animal {\n void sound() { System.out.print("X"); }\n}\npublic class Dog extends Animal {\n void sound() { System.out.print("Y"); }\n}\npublic class myMain {\n public static void main(String[] args) {\n  Animal a1 = new Dog();\n  Animal a2 = new Animal();\n  a1.sound();\n  a2.sound();\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'XX' },
                    { id: 'b', textEn: 'YY' },
                    { id: 'c', textEn: 'YX' },
                    { id: 'd', textEn: 'XY' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 19,
                type: 'mcq',
                questionEn: 'Suppose a class \'Employee\' with a private instance variable \'salary\' of type double, choose the correct header to a getter method for the \'salary\'?',
                options: [
                    { id: 'a', textEn: 'public void getSalary()' },
                    { id: 'b', textEn: 'public int getSalary(double s)' },
                    { id: 'c', textEn: 'public double getSalary()' },
                    { id: 'd', textEn: 'public String getSalary(double salary)' },
                    { id: 'e', textEn: 'public void getSalary(double salary)' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 20,
                type: 'mcq',
                questionEn: 'What would be the output of the code?<br><pre><code class="language-java">public static void main(String[] args) {\n try {\n  int [] a = {4, 1, 18};\n  a[5]= a[1] / 0;\n  System.out.print("A");\n }\n catch (ArithmeticException e)\n { System.out.print("B"); }\n catch (Exception e) {\n  System.out.print("C");\n }\n finally {\n  System.out.print("D");\n }\n}</code></pre>',
                options: [
                    { id: 'a', textEn: 'ABCD' },
                    { id: 'b', textEn: 'BD' },
                    { id: 'c', textEn: 'CD' },
                    { id: 'd', textEn: 'D' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 21,
                type: 'mcq',
                questionEn: 'Suppose that you have the following three classes: X, Y, and Z, and you have the following three interfaces: A, B, and C. Which of following declarations is correct?',
                options: [
                    { id: 'a', textEn: 'class X extends Y, Z { }' },
                    { id: 'b', textEn: 'interface A implements B { }' },
                    { id: 'c', textEn: 'interface A extends B implements C { }' },
                    { id: 'd', textEn: 'class X implements A, B { }' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 22,
                type: 'mcq',
                questionEn: 'When does the code inside a `catch` block execute in Java?',
                options: [
                    { id: 'a', textEn: 'Always, whether an exception occurs or not.' },
                    { id: 'b', textEn: 'Only when an exception of the specified type occurs.' },
                    { id: 'c', textEn: 'Before the try block executes.' },
                    { id: 'd', textEn: 'When the program starts.' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 23,
                type: 'mcq',
                questionEn: 'If a method is declared as `final` in Java, what does it mean?',
                options: [
                    { id: 'a', textEn: 'It can only return integer values.' },
                    { id: 'b', textEn: 'It must be declared as static.' },
                    { id: 'c', textEn: 'It cannot be overridden by subclasses.' },
                    { id: 'd', textEn: 'It can only be called once.' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 24,
                type: 'mcq',
                questionEn: 'What is the default access modifier for a method declared within a Java interface?',
                options: [
                    { id: 'a', textEn: 'private' },
                    { id: 'b', textEn: 'protected' },
                    { id: 'c', textEn: 'public abstract' },
                    { id: 'd', textEn: 'default (package-access)' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 25,
                type: 'mcq',
                questionEn: 'Which methods must be implemented when a concrete class extends an abstract class?',
                options: [
                    { id: 'a', textEn: 'All methods' },
                    { id: 'b', textEn: 'All abstract methods' },
                    { id: 'c', textEn: 'Only static methods' },
                    { id: 'd', textEn: 'Only final methods' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 26,
                type: 'mcq',
                questionEn: 'What does the "instanceof" operator return in Java?',
                options: [
                    { id: 'a', textEn: 'A boolean value' },
                    { id: 'b', textEn: 'An integer value' },
                    { id: 'c', textEn: 'A string value' },
                    { id: 'd', textEn: 'An object reference' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 27,
                type: 'mcq',
                questionEn: 'In Java, a subclass inherits all the members (fields and methods) of its superclass, including private members.',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 28,
                type: 'mcq',
                questionEn: 'The `super` keyword can be used to call the superclass constructor from a subclass constructor.',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 29,
                type: 'mcq',
                questionEn: 'What access modifier allows a member to be accessible only within the same package but not by subclasses outside the package?',
                options: [
                    { id: 'a', textEn: 'private' },
                    { id: 'b', textEn: 'public' },
                    { id: 'c', textEn: 'protected' },
                    { id: 'd', textEn: 'default (package-access)' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 30,
                type: 'mcq',
                questionEn: 'Can you create an instance of an interface in Java using the `new` keyword?',
                options: [
                    { id: 'a', textEn: 'No, you cannot directly instantiate an interface.' },
                    { id: 'b', textEn: 'Yes, if it has at least one method.' },
                    { id: 'c', textEn: 'Yes, but only if all methods have default implementations.' },
                    { id: 'd', textEn: 'Yes, if you use the `create` keyword.' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            }
        ]
    },
    oop_quizzes: {
        id: 'oop_quizzes',
        title: 'Quizzes',
        titleAr: 'كويزات',
        icon: '💻',
        color: '#2196F3',
        forceEnglish: true,
        questions: []
    },
    comp_skills: {
        id: 'comp_skills',
        title: 'Computer Skills',
        titleAr: 'مهارات حاسوب والتعلم الالكتروني',
        icon: '💻',
        color: '#00BCD4',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Which of the following is considered the heart of a computer?',
                questionAr: 'أي مما يلي يعتبر قلب جهاز الحاسوب؟',
                options: [
                    { id: 'a', textEn: 'Mouse', textAr: 'فأرة' },
                    { id: 'b', textEn: 'Monitor', textAr: 'شاشة' },
                    { id: 'c', textEn: 'Processor (CPU)', textAr: 'المعالج' },
                    { id: 'd', textEn: 'Keyboard', textAr: 'لوحة المفاتيح' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'What is the main function of the operating system?',
                questionAr: 'ما هي الوظيفة الرئيسية لنظام التشغيل؟',
                options: [
                    { id: 'a', textEn: 'Word processing', textAr: 'معالجة النصوص' },
                    { id: 'b', textEn: 'Manage hardware and software resources', textAr: 'إدارة موارد الأجهزة والبرامج' },
                    { id: 'c', textEn: 'Create graphics', textAr: 'إنشاء الرسومات' },
                    { id: 'd', textEn: 'Send emails', textAr: 'إرسال البريد الإلكتروني' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Which memory is used for temporary storage while the computer is running?',
                questionAr: 'أي ذاكرة تستخدم للتخزين المؤقت أثناء تشغيل الكمبيوتر؟',
                options: [
                    { id: 'a', textEn: 'ROM', textAr: 'ذاكرة القراءة فقط' },
                    { id: 'b', textEn: 'Hard Disk', textAr: 'القرص الصلب' },
                    { id: 'c', textEn: 'RAM', textAr: 'ذاكرة الوصول العشوائي' },
                    { id: 'd', textEn: 'Flash Drive', textAr: 'محرك أقراص فلاش' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'A set of instructions that tells the computer what to do is called:',
                questionAr: 'مجموعة من التعليمات التي تخبر الكمبيوتر بما يجب فعله تسمى:',
                options: [
                    { id: 'a', textEn: 'Hardware', textAr: 'الأجهزة' },
                    { id: 'b', textEn: 'Software', textAr: 'البرمجيات' },
                    { id: 'c', textEn: 'Input device', textAr: 'جهاز إدخال' },
                    { id: 'd', textEn: 'Output device', textAr: 'جهاز إخراج' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Which of the following is an input device?',
                questionAr: 'أي مما يلي يعتبر جهاز إدخال؟',
                options: [
                    { id: 'a', textEn: 'Printer', textAr: 'طابعة' },
                    { id: 'b', textEn: 'Speakers', textAr: 'سماعات' },
                    { id: 'c', textEn: 'Scanner', textAr: 'ماسح ضوئي' },
                    { id: 'd', textEn: 'Monitor', textAr: 'شاشة' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'What does URL stand for?',
                questionAr: 'إلام يرمز اختصار URL؟',
                options: [
                    { id: 'a', textEn: 'Uniform Resource Locator', textAr: 'محدد موقع الموارد الموحد' },
                    { id: 'b', textEn: 'Universal Radio Level', textAr: 'مستوى الراديو العالمي' },
                    { id: 'c', textEn: 'User Response Link', textAr: 'رابط استجابة المستخدم' },
                    { id: 'd', textEn: 'United Resource Line', textAr: 'خط الموارد المتحدة' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Which of the following is an example of a web browser?',
                questionAr: 'أي مما يلي يعتبر مثالاً على متصفح ويب؟',
                options: [
                    { id: 'a', textEn: 'Microsoft Word', textAr: 'مايكروسوفت وورد' },
                    { id: 'b', textEn: 'Google Chrome', textAr: 'جوجل كروم' },
                    { id: 'c', textEn: 'Adobe Photoshop', textAr: 'أدوبي فوتوشوب' },
                    { id: 'd', textEn: 'Windows 10', textAr: 'ويندوز 10' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Small text files stored on your computer by websites to remember your preferences are called:',
                questionAr: 'ملفات نصية صغيرة يتم تخزينها على جهاز الكمبيوتر الخاص بك بواسطة مواقع الويب لتذكر تفضيلاتك تسمى:',
                options: [
                    { id: 'a', textEn: 'Links', textAr: 'روابط' },
                    { id: 'b', textEn: 'Bookmarks', textAr: 'إشارات مرجعية' },
                    { id: 'c', textEn: 'Cookies', textAr: 'ملفات تعريف الارتباط' },
                    { id: 'd', textEn: 'Downloads', textAr: 'تنزيلات' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'What is the most secure way to protect your computer from unauthorized access?',
                questionAr: 'ما هي الطريقة الأكثر أماناً لحماية جهاز الكمبيوتر الخاص بك من الوصول غير المصرح به؟',
                options: [
                    { id: 'a', textEn: 'Turn off the monitor', textAr: 'إيقاف تشغيل الشاشة' },
                    { id: 'b', textEn: 'Use a strong password', textAr: 'استخدم كلمة مرور قوية' },
                    { id: 'c', textEn: 'Delete all emails', textAr: 'حذف جميع رسائل البريد الإلكتروني' },
                    { id: 'd', textEn: 'Install more RAM', textAr: 'تثبيت المزيد من ذاكرة الوصول العشوائي' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'Which protocol is used to send emails?',
                questionAr: 'أي بروتوكول يستخدم لإرسال رسائل البريد الإلكتروني؟',
                options: [
                    { id: 'a', textEn: 'HTTP', textAr: 'HTTP' },
                    { id: 'b', textEn: 'FTP', textAr: 'FTP' },
                    { id: 'c', textEn: 'SMTP', textAr: 'SMTP' },
                    { id: 'd', textEn: 'IP', textAr: 'IP' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 11,
                type: 'mcq',
                questionEn: 'The physical parts of a computer are known as:',
                questionAr: 'الأجزاء المادية للكمبيوتر تسمى:',
                options: [
                    { id: 'a', textEn: 'Software', textAr: 'البرمجيات' },
                    { id: 'b', textEn: 'Data', textAr: 'البيانات' },
                    { id: 'c', textEn: 'Hardware', textAr: 'الأجهزة' },
                    { id: 'd', textEn: 'Firmware', textAr: 'البرامج الثابتة' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 12,
                type: 'mcq',
                questionEn: 'Converting data into a secret code to prevent unauthorized access is called:',
                questionAr: 'يُطلق على تحويل البيانات إلى كود سري لمنع الوصول غير المصرح به اسم:',
                options: [
                    { id: 'a', textEn: 'Encryption', textAr: 'التشفير' },
                    { id: 'b', textEn: 'Decryption', textAr: 'فك التشفير' },
                    { id: 'c', textEn: 'Cracking', textAr: 'الكسر' },
                    { id: 'd', textEn: 'Ethical Hacking', textAr: 'القرصنة الأخلاقية' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 13,
                type: 'mcq',
                questionEn: 'A program that secretly installs itself on computers and collects information about users without their knowledge:',
                questionAr: 'برنامج يثبت نفسه سراً على أجهزة الكمبيوتر ويجمع معلومات عن المستخدمين دون علمهم:',
                options: [
                    { id: 'a', textEn: 'Virus', textAr: 'فيروس' },
                    { id: 'b', textEn: 'Keystroke logging', textAr: 'تسجيل ضغطات المفاتيح' },
                    { id: 'c', textEn: 'Spyware', textAr: 'برامج التجسس' },
                    { id: 'd', textEn: 'Adware', textAr: 'برامج إعلانية' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            }
        ]
    },
    digital_society_1: {
        id: 'digital_society_1',
        title: 'Digital Society - Part 1',
        titleAr: 'مجتمع رقمي - الجزء 1',
        icon: '🌐',
        color: '#9C27B0',
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionAr: 'الذاكرة التي تخزن التعليمات والبيانات والتي يتم الوصول لها بشكل فعال من قبل المعالج هي ...؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'ذاكرة القراءة فقط' },
                    { id: 'b', textAr: 'ذاكرة التخزين الموقتة' },
                    { id: 'c', textAr: 'الرقاقات الاكترونية' },
                    { id: 'd', textAr: 'ذاكرة الوصول العشوائي' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 2,
                type: 'mcq',
                questionAr: '........... تعتبر من وسائل الادخال والاخراج معنا ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الماوس' },
                    { id: 'b', textAr: 'السماعات' },
                    { id: 'c', textAr: 'لوحة المفاتيح' },
                    { id: 'd', textAr: 'شاشة اللمس' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 3,
                type: 'mcq',
                questionAr: 'إحدى التالي لا تعتبر من أنظمة التشغيل ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'Mac OS' },
                    { id: 'b', textAr: 'Microsoft Power Pointst' },
                    { id: 'c', textAr: 'Windows' },
                    { id: 'd', textAr: 'Linux' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 4,
                type: 'mcq',
                questionAr: 'وحدة المعالجات الرسومية هي ........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'RAM' },
                    { id: 'b', textAr: 'CPU' },
                    { id: 'c', textAr: 'GPU' },
                    { id: 'd', textAr: 'ROM' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 5,
                type: 'mcq',
                questionAr: 'تصل المعالج بالعديد من الاجزاء الداخلية لجهاز الحاسوب .........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'وحدة المعالجة المركزية' },
                    { id: 'b', textAr: 'الناقلات' },
                    { id: 'c', textAr: 'ذاكرة الوصول العشوائي' },
                    { id: 'd', textAr: 'برمجيات النظام' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 6,
                type: 'mcq',
                questionAr: 'من وظائف نظام التشغيل ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'طباعة المستندات والتقارير' },
                    { id: 'b', textAr: 'تصميم العروض التقديمية' },
                    { id: 'c', textAr: 'إدارة وتخصيص مصادر الحاسوب' },
                    { id: 'd', textAr: 'تصميم الجداول الاكترونية' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 7,
                type: 'mcq',
                questionAr: 'CPU is ........................?',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'Central Performance Unit' },
                    { id: 'b', textAr: 'Central Programming Unit' },
                    { id: 'c', textAr: 'Central Processing Unit' },
                    { id: 'd', textAr: 'Graphical Processing Unit' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            }
        ]
    },
    digital_society_2: {
        id: 'digital_society_2',
        title: 'Digital Society - Part 2',
        titleAr: 'مجتمع رقمي - الجزء 2',
        icon: '🌐',
        color: '#9C27B0',
        questions: [
            {
                id: 8,
                type: 'mcq',
                questionAr: 'لقد كنا نعيش في نهاية قرن .......... ، في ما يسمى بالمجتمع الصناعي ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'التسعينات' },
                    { id: 'b', textAr: 'العشرينات' },
                    { id: 'c', textAr: 'السبعينات' },
                    { id: 'd', textAr: 'الثمنيات' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 9,
                type: 'mcq',
                questionAr: 'مجموعه من مسميات للمجتمع المعلومات الرقمية جميع ما ذكر صحيح ما عاد ..؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'المجتمع ما بعد الصناعي' },
                    { id: 'b', textAr: 'المجتمع التكنوقراطي' },
                    { id: 'c', textAr: 'المجتمع البرمج' },
                    { id: 'd', textAr: 'الحضارة الاكترونية ما بعد الابجدية' },
                    { id: 'e', textAr: 'الموجة الحديث' }
                ],
                correctAnswer: 'e',
                marks: 2.0
            },
            {
                id: 10,
                type: 'mcq',
                questionAr: 'المجتمع الصناعي الحالي هوا انتاج الثروة الصناعية التي ظهرت في قرن ........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الثامن عشر' },
                    { id: 'b', textAr: 'الحادي عشر' },
                    { id: 'c', textAr: 'التاسع عشر' },
                    { id: 'd', textAr: 'الرابع عشر' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 11,
                type: 'tf',
                questionAr: 'مجتمع الحداثة هوا التعبير الفكري والثقافي عن روح هذا المجتمع والقوى الفاعلة فيه ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 12,
                type: 'mcq',
                questionAr: 'المجتمع الحداثة مجتمع يقوم على ..........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الابتكار والمعرفة' },
                    { id: 'b', textAr: 'الصناعة والفن' },
                    { id: 'c', textAr: 'الابداع والبراعة' },
                    { id: 'd', textAr: 'العلم والمعرفة والعقلانية' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 13,
                type: 'tf',
                questionAr: 'المجتمع المعلومات هوا مبحثا فكريا شائعا وهاما متفاعلا بذاته ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 14,
                type: 'tf',
                questionAr: 'بظهور مجتمع المعلومات ظهرات عدة مفاهيم مرافقة ومنها المجتمع المعرفة ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 15,
                type: 'mcq',
                questionAr: 'بظهور مجتمع المعلومات ظهرات عدة مفاهيم مرافقة ومنها',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الاكتروني' },
                    { id: 'b', textAr: 'المجتمع الرقمي' },
                    { id: 'c', textAr: 'الاتصالات' },
                    { id: 'd', textAr: 'جيمع ما ذكر' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 16,
                type: 'mcq',
                questionAr: 'من هوا العالم الذي قسم الحضارات الانسانية الى ثلاث مراحل وكما يسميها بالموجات ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الان تورين' },
                    { id: 'b', textAr: 'مانويل كاستلز' },
                    { id: 'c', textAr: 'الفن توفلر' },
                    { id: 'd', textAr: 'فريدريك وينسلو تايلور' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 17,
                type: 'tf',
                questionAr: 'الحضارات الانسانية انقسمت الى ثلاث حضارات حضاره الاولى كانت الثروة الصناعية ؟',
                questionEn: '',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 18,
                type: 'mcq',
                questionAr: 'المرحلة الثانية من الحضارة الانسانية وقعت بي قرن ..........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'القرن الاول' },
                    { id: 'b', textAr: 'قبل قرنين' },
                    { id: 'c', textAr: 'قبل ثلاثة قرون' },
                    { id: 'd', textAr: 'قبل ثلاثين قرن' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 19,
                type: 'tf',
                questionAr: 'الموجة الثانية من الحضارة الانسانية كانت بداية الثورة الصناعية ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 20,
                type: 'tf',
                questionAr: 'من اهم ما يمز مرحلة العصر الزراعي على انها الاعتماد على الارض والخيرات الطبيعية كمورد اساسي؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 21,
                type: 'mcq',
                questionAr: 'الهدف من الثروة الصناعية هوا ........؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'حصول على كفاءة العمل' },
                    { id: 'b', textAr: 'حصول على كفاءة في مستقبل' },
                    { id: 'c', textAr: 'الوصول الى كفاءة الآلة' },
                    { id: 'd', textAr: 'الوصول الى ثروة حديثة' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 22,
                type: 'mcq',
                questionAr: 'من هوا اول من طبق المعرفة في دراسة وتحليل هندسة العمل ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'مانويل كاستلز' },
                    { id: 'b', textAr: 'الفن توفلر' },
                    { id: 'c', textAr: 'تورين' },
                    { id: 'd', textAr: 'فريدريك ونسلو' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 23,
                type: 'mcq',
                questionAr: 'تعتبر مرحلة العصر المعلومات احدث ما عاشة الإنسان من تطور وكانت بداياته ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'القرن العشرين' },
                    { id: 'b', textAr: 'النصف الاول من قرن العشرين' },
                    { id: 'c', textAr: 'النصف الثاني من قرن الشرين' },
                    { id: 'd', textAr: 'قبل قرن العشرين' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 24,
                type: 'mcq',
                questionAr: 'في المرحلة لمن تنشأ فجأة ، بل كانت موجودة طول تاريخ البشرية ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'مرحلة الاولى' },
                    { id: 'b', textAr: 'مرحلة الثانية' },
                    { id: 'c', textAr: 'مرحلة الثالثة' },
                    { id: 'd', textAr: 'مرحلة الرابعة' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 25,
                type: 'tf',
                questionAr: 'العمل الذهني من موارد الاساسية لمجتمع المعلوماتي ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            }
        ]
    },
    digital_society_3: {
        id: 'digital_society_3',
        title: 'Digital Society - Part 3',
        titleAr: 'مجتمع رقمي - الجزء 3',
        icon: '🌐',
        color: '#9C27B0',
        questions: [
            {
                id: 26,
                type: 'mcq',
                questionAr: 'في الثروة الثانية من مراحل تطور التكنولوجيا معلومات التي تميزت باختراع أقدم طريقة للكتابة في العالم وهيا طريقة:',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'العضويه' },
                    { id: 'b', textAr: 'العصرية' },
                    { id: 'c', textAr: 'السومرية' },
                    { id: 'd', textAr: 'الاحديثه' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 27,
                type: 'mcq',
                questionAr: 'الثروة الثالث من مراحل تطور التكنولوجيا معلومات كانت بظهور الطباعة في منتصف القرن .....؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الحادي والعشرين' },
                    { id: 'b', textAr: 'الحادي عشر' },
                    { id: 'c', textAr: 'الرابعه عشر' },
                    { id: 'd', textAr: 'الخامسه عشر' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 28,
                type: 'tf',
                questionAr: 'يقال اتفق معظم المؤرخين على أن " يوحنا جوتنبرج " هوا اول من فكر في اختراع الطباعة بالحروف المعدنية المنفصلة ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 29,
                type: 'tf',
                questionAr: 'في عام 1876 اخترع الهاتف لنقل الاصوات إلى مسافات بعيدة المدى ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 30,
                type: 'mcq',
                questionAr: 'في اي ثروة من مراحل تطور التكنولوجيا معلومات تمثلت في استخدام الاقمار الصناعية لنقل المعلومات والبيانات والصور عبر الدول والقارات',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'الثروة الاولى' },
                    { id: 'b', textAr: 'الثروة الثانية' },
                    { id: 'c', textAr: 'الثروة الثالثة' },
                    { id: 'd', textAr: 'الثروة الرابعه' },
                    { id: 'e', textAr: 'الثروة الخامسه' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 31,
                type: 'mcq',
                questionAr: 'يعرف البروتوكول الانترنت بي ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'TOP/IP' },
                    { id: 'b', textAr: 'TCP/ID' },
                    { id: 'c', textAr: 'TCP/It' },
                    { id: 'd', textAr: 'TCP/IP' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 32,
                type: 'tf',
                questionAr: 'تبين في نطاق الخصائص الانترنت نطاقه محلي وعالمي ومن محلي Local',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 33,
                type: 'tf',
                questionAr: 'منع احتكار المعلومات من مميزات الانترنت ؟',
                questionEn: '',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 34,
                type: 'mcq',
                questionAr: 'معرف الموارد الموحد هوا ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'TCP' },
                    { id: 'b', textAr: 'URI' },
                    { id: 'c', textAr: 'IT' },
                    { id: 'd', textAr: 'UDP' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 35,
                type: 'mcq',
                questionAr: 'مزود خدمة الانترنت او موفر خدمة الاتصال بالانترنت ؟',
                questionEn: '',
                options: [
                    { id: 'a', textAr: 'ISP' },
                    { id: 'b', textAr: 'TCP' },
                    { id: 'c', textAr: 'TCP/IP' },
                    { id: 'd', textAr: 'UDP' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            }
        ]
    },
    vr_biz_1: {
        id: 'vr_biz_1',
        title: 'Business VR - Part 1',
        titleAr: 'مبادئ الأعمال (VR) - الجزء 1',
        icon: '💼',
        color: '#607D8B',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'What is the primary function of planning in management?', questionAr: '', options: [{ id: 'a', textEn: 'Organizing resources' }, { id: 'b', textEn: 'Making decisions' }, { id: 'c', textEn: 'Setting objectives' }, { id: 'd', textEn: 'Monitoring performance' }], correctAnswer: 'c', marks: 1 },
            { id: 2, type: 'mcq', questionEn: 'Which of the following is considered an element of administrative organization?', questionAr: '', options: [{ id: 'a', textEn: 'Strategic planning' }, { id: 'b', textEn: 'Defining roles' }, { id: 'c', textEn: 'Creating budgets' }, { id: 'd', textEn: 'Decision-making' }], correctAnswer: 'b', marks: 1 },
            { id: 3, type: 'mcq', questionEn: 'What is the main objective of the recruitment process?', questionAr: '', options: [{ id: 'a', textEn: 'Improving social relations' }, { id: 'b', textEn: 'Achieving efficiency and effectiveness' }, { id: 'c', textEn: 'Reducing costs' }, { id: 'd', textEn: 'Developing new plans' }], correctAnswer: 'b', marks: 1 },
            { id: 4, type: 'mcq', questionEn: 'Which of these tasks is part of administrative control?', questionAr: '', options: [{ id: 'a', textEn: 'Preparing plans' }, { id: 'b', textEn: 'Evaluating performance' }, { id: 'c', textEn: 'Distributing tasks' }, { id: 'd', textEn: 'Training employees' }], correctAnswer: 'b', marks: 1 },
            { id: 5, type: 'mcq', questionEn: 'What is the first step in the decision-making process?', questionAr: '', options: [{ id: 'a', textEn: 'Gathering information' }, { id: 'b', textEn: 'Developing alternatives' }, { id: 'c', textEn: 'Identifying the problem' }, { id: 'd', textEn: 'Implementing the decision' }], correctAnswer: 'c', marks: 1 },
            { id: 6, type: 'mcq', questionEn: 'Who is responsible for implementing the overall objectives in an organization?', questionAr: '', options: [{ id: 'a', textEn: 'Top management' }, { id: 'b', textEn: 'Middle management' }, { id: 'c', textEn: 'Lower management' }, { id: 'd', textEn: 'Employees' }], correctAnswer: 'b', marks: 1 },
            { id: 7, type: 'mcq', questionEn: 'What is the difference between a leader and a manager in terms of leadership?', questionAr: '', options: [{ id: 'a', textEn: 'A leader focuses on productivity, and a manager focuses on relationships' }, { id: 'b', textEn: 'A leader inspires, while a manager focuses on performance' }, { id: 'c', textEn: 'A leader does not make decisions, while a manager does' }, { id: 'd', textEn: 'A leader works alone, while a manager works in a team' }], correctAnswer: 'b', marks: 1 },
            { id: 8, type: 'mcq', questionEn: 'Which of the following is considered a leadership skill?', questionAr: '', options: [{ id: 'a', textEn: 'Technical skills only' }, { id: 'b', textEn: 'Intellectual skills only' }, { id: 'c', textEn: 'Human skills only' }, { id: 'd', textEn: 'All of the above' }], correctAnswer: 'd', marks: 1 },
            { id: 9, type: 'mcq', questionEn: 'What is the primary objective of public administration?', questionAr: '', options: [{ id: 'a', textEn: 'Achieving profit' }, { id: 'b', textEn: 'Providing services to the community' }, { id: 'c', textEn: 'Managing business operations' }, { id: 'd', textEn: 'Increasing revenues' }], correctAnswer: 'b', marks: 1 },
            { id: 10, type: 'mcq', questionEn: 'Which of the following factors affects the decision-making process?', questionAr: '', options: [{ id: 'a', textEn: 'Previous experiences' }, { id: 'b', textEn: 'Available information' }, { id: 'c', textEn: 'External pressures' }, { id: 'd', textEn: 'All of the above' }], correctAnswer: 'd', marks: 1 },
            { id: 11, type: 'mcq', questionEn: 'What is the purpose of budgeting in management?', questionAr: '', options: [{ id: 'a', textEn: 'To monitor performance' }, { id: 'b', textEn: 'To manage financial resources' }, { id: 'c', textEn: 'To evaluate employee performance' }, { id: 'd', textEn: 'To organize tasks' }], correctAnswer: 'b', marks: 1 },
            { id: 12, type: 'mcq', questionEn: 'Which level of management is responsible for strategic planning?', questionAr: '', options: [{ id: 'a', textEn: 'Top management' }, { id: 'b', textEn: 'Middle management' }, { id: 'c', textEn: 'Lower management' }, { id: 'd', textEn: 'All levels' }], correctAnswer: 'a', marks: 1 },
            { id: 13, type: 'mcq', questionEn: 'What is a key characteristic of effective leadership?', questionAr: '', options: [{ id: 'a', textEn: 'Authoritarian approach' }, { id: 'b', textEn: 'Open communication' }, { id: 'c', textEn: 'Strict policies' }, { id: 'd', textEn: 'Isolation from staff' }], correctAnswer: 'b', marks: 1 },
            { id: 14, type: 'mcq', questionEn: 'What is the main role of middle management?', questionAr: '', options: [{ id: 'a', textEn: 'Setting overall goals' }, { id: 'b', textEn: 'Implementing operational plans' }, { id: 'c', textEn: 'Supervising employees directly' }, { id: 'd', textEn: 'Creating company culture' }], correctAnswer: 'b', marks: 1 }
        ]
    },
    vr_biz_2: {
        id: 'vr_biz_2',
        title: 'Business VR - Part 2',
        titleAr: 'مبادئ الأعمال (VR) - الجزء 2',
        icon: '💼',
        color: '#607D8B',
        forceEnglish: true,
        questions: [
            { id: 15, type: 'mcq', questionEn: 'What is an essential skill for a manager?', questionAr: '', options: [{ id: 'a', textEn: 'Technical skills metric' }, { id: 'b', textEn: 'Human skills' }, { id: 'c', textEn: 'Artistic skills' }, { id: 'd', textEn: 'None of the above' }], correctAnswer: 'b', marks: 1 },
            { id: 16, type: 'mcq', questionEn: 'The process of monitoring and evaluating performance is known as:', questionAr: '', options: [{ id: 'a', textEn: 'Planning' }, { id: 'b', textEn: 'Organizing' }, { id: 'c', textEn: 'Controlling' }, { id: 'd', textEn: 'Staffing' }], correctAnswer: 'c', marks: 1 },
            { id: 17, type: 'mcq', questionEn: 'What is the primary source of funding for public administration?', questionAr: '', options: [{ id: 'a', textEn: 'Private donations' }, { id: 'b', textEn: 'Taxes' }, { id: 'c', textEn: 'Loans' }, { id: 'd', textEn: 'Investments' }], correctAnswer: 'b', marks: 1 },
            { id: 18, type: 'mcq', questionEn: 'Which of the following describes a decentralized organization?', questionAr: '', options: [{ id: 'a', textEn: 'All decisions are made at the top level' }, { id: 'b', textEn: 'Decision-making is distributed among various levels' }, { id: 'c', textEn: 'There is no authority hierarchy' }, { id: 'd', textEn: 'None of the above' }], correctAnswer: 'b', marks: 1 },
            { id: 19, type: 'mcq', questionEn: 'What is the function of human resource management?', questionAr: '', options: [{ id: 'a', textEn: 'To manage financial assets' }, { id: 'b', textEn: 'To oversee employee development' }, { id: 'c', textEn: 'To create marketing strategies' }, { id: 'd', textEn: 'To manage physical resources' }], correctAnswer: 'b', marks: 1 },
            { id: 20, type: 'mcq', questionEn: 'Which of the following is a characteristic of a good leader?', questionAr: '', options: [{ id: 'a', textEn: 'Inflexibility' }, { id: 'b', textEn: 'Empathy' }, { id: 'c', textEn: 'Lack of vision' }, { id: 'd', textEn: 'Resistance to change' }], correctAnswer: 'b', marks: 1 },
            { id: 21, type: 'mcq', questionEn: 'What type of planning focuses on long-term goals?', questionAr: '', options: [{ id: 'a', textEn: 'Tactical planning' }, { id: 'b', textEn: 'Operational planning' }, { id: 'c', textEn: 'Strategic planning' }, { id: 'd', textEn: 'Contingency planning' }], correctAnswer: 'c', marks: 1 },
            { id: 22, type: 'mcq', questionEn: 'Which management function involves assigning tasks to employees?', questionAr: '', options: [{ id: 'a', textEn: 'Planning' }, { id: 'b', textEn: 'Organizing' }, { id: 'c', textEn: 'Leading' }, { id: 'd', textEn: 'Controlling' }], correctAnswer: 'b', marks: 1 },
            { id: 23, type: 'mcq', questionEn: 'What is the purpose of strategic management?', questionAr: '', options: [{ id: 'a', textEn: 'To ensure day-to-day operations run smoothly' }, { id: 'b', textEn: 'To align resources with the organization’s goals' }, { id: 'c', textEn: 'To evaluate employee performance' }, { id: 'd', textEn: 'To develop marketing plans' }], correctAnswer: 'b', marks: 1 },
            { id: 24, type: 'mcq', questionEn: 'What is the primary goal of performance appraisal?', questionAr: '', options: [{ id: 'a', textEn: 'To promote employees' }, { id: 'b', textEn: 'To identify training needs' }, { id: 'c', textEn: 'To increase salaries' }, { id: 'd', textEn: 'To create competition among employees' }], correctAnswer: 'b', marks: 1 },
            { id: 25, type: 'mcq', questionEn: 'Which of the following is NOT a function of management?', questionAr: '', options: [{ id: 'a', textEn: 'Planning' }, { id: 'b', textEn: 'Organizing' }, { id: 'c', textEn: 'Socializing' }, { id: 'd', textEn: 'Controlling' }], correctAnswer: 'c', marks: 1 },
            { id: 26, type: 'mcq', questionEn: 'What is a common challenge in team management?', questionAr: '', options: [{ id: 'a', textEn: 'High morale' }, { id: 'b', textEn: 'Effective communication' }, { id: 'c', textEn: 'Clear objectives' }, { id: 'd', textEn: 'Shared responsibilities' }], correctAnswer: 'b', marks: 1 },
            { id: 27, type: 'mcq', questionEn: 'What does effective delegation involve?', questionAr: '', options: [{ id: 'a', textEn: 'Assigning tasks without authority' }, { id: 'b', textEn: 'Sharing responsibility and authority' }, { id: 'c', textEn: 'Micromanaging every task' }, { id: 'd', textEn: 'Avoiding accountability' }], correctAnswer: 'b', marks: 1 },
            { id: 28, type: 'mcq', questionEn: 'What is the primary purpose of a mission statement?', questionAr: '', options: [{ id: 'a', textEn: 'To outline financial goals' }, { id: 'b', textEn: 'To describe the organization’s purpose' }, { id: 'c', textEn: 'To set employee performance metrics' }, { id: 'd', textEn: 'To define marketing strategies' }], correctAnswer: 'b', marks: 1 }
        ]
    },
    vr_biz_3: {
        id: 'vr_biz_3',
        title: 'Business VR - Part 3',
        titleAr: 'مبادئ الأعمال (VR) - الجزء 3',
        icon: '💼',
        color: '#607D8B',
        forceEnglish: true,
        questions: [
            { id: 29, type: 'mcq', questionEn: 'What is the role of an organizational chart?', questionAr: '', options: [{ id: 'a', textEn: 'To evaluate employee performance' }, { id: 'b', textEn: 'To illustrate the structure of an organization' }, { id: 'c', textEn: 'To create marketing plans' }, { id: 'd', textEn: 'To manage financial resources' }], correctAnswer: 'b', marks: 1 },
            { id: 30, type: 'mcq', questionEn: 'Which of the following is a benefit of teamwork?', questionAr: '', options: [{ id: 'a', textEn: 'Increased competition' }, { id: 'b', textEn: 'Enhanced creativity' }, { id: 'c', textEn: 'Individual accountability' }, { id: 'd', textEn: 'Isolation of team members' }], correctAnswer: 'b', marks: 1 },
            { id: 31, type: 'mcq', questionEn: 'What is the first step in the strategic management process?', questionAr: '', options: [{ id: 'a', textEn: 'Developing strategies' }, { id: 'b', textEn: 'Identifying the organization\'s mission' }, { id: 'c', textEn: 'Evaluating performance' }, { id: 'd', textEn: 'Allocating resources' }], correctAnswer: 'b', marks: 1 },
            { id: 32, type: 'mcq', questionEn: 'What does SWOT analysis stand for?', questionAr: '', options: [{ id: 'a', textEn: 'Strengths, Weaknesses, Opportunities, Threats' }, { id: 'b', textEn: 'Strategies, Weaknesses, Objectives, Tactics' }, { id: 'c', textEn: 'Strengths, Wins, Objectives, Targets' }, { id: 'd', textEn: 'None of the above' }], correctAnswer: 'a', marks: 1 },
            { id: 33, type: 'mcq', questionEn: 'Which style of leadership is characterized by a hands-off approach?', questionAr: '', options: [{ id: 'a', textEn: 'Autocratic' }, { id: 'b', textEn: 'Democratic' }, { id: 'c', textEn: 'Laissez-faire' }, { id: 'd', textEn: 'Transformational' }], correctAnswer: 'c', marks: 1 },
            { id: 34, type: 'mcq', questionEn: 'What is the role of a facilitator in a team meeting?', questionAr: '', options: [{ id: 'a', textEn: 'To dominate the discussion' }, { id: 'b', textEn: 'To guide the process' }, { id: 'c', textEn: 'To evaluate team performance' }, { id: 'd', textEn: 'To make all decisions' }], correctAnswer: 'b', marks: 1 },
            { id: 35, type: 'mcq', questionEn: 'What is a key advantage of a flat organizational structure?', questionAr: '', options: [{ id: 'a', textEn: 'Increased bureaucracy' }, { id: 'b', textEn: 'Faster decision-making' }, { id: 'c', textEn: 'More management layers' }, { id: 'd', textEn: 'Clearer communication' }], correctAnswer: 'b', marks: 1 },
            { id: 36, type: 'mcq', questionEn: 'What is the purpose of a contingency plan?', questionAr: '', options: [{ id: 'a', textEn: 'To set long-term goals' }, { id: 'b', textEn: 'To address potential crises' }, { id: 'c', textEn: 'To define organizational structure' }, { id: 'd', textEn: 'To manage day-to-day operations' }], correctAnswer: 'b', marks: 1 },
            { id: 37, type: 'mcq', questionEn: 'What is the main focus of operations management?', questionAr: '', options: [{ id: 'a', textEn: 'Financial planning' }, { id: 'b', textEn: 'Day-to-day operations' }, { id: 'c', textEn: 'Strategic planning' }, { id: 'd', textEn: 'Human resource management' }], correctAnswer: 'b', marks: 1 },
            { id: 38, type: 'mcq', questionEn: 'Which of the following is a disadvantage of centralized decision-making?', questionAr: '', options: [{ id: 'a', textEn: 'Slower response time' }, { id: 'b', textEn: 'Clear authority' }, { id: 'c', textEn: 'Consistency in decisions' }, { id: 'd', textEn: 'Reduced risk of mistakes' }], correctAnswer: 'a', marks: 1 },
            { id: 39, type: 'mcq', questionEn: 'What is the primary focus of marketing management?', questionAr: '', options: [{ id: 'a', textEn: 'Financial planning' }, { id: 'b', textEn: 'Promoting and selling products' }, { id: 'c', textEn: 'Managing human resources' }, { id: 'd', textEn: 'Overseeing operations' }], correctAnswer: 'b', marks: 1 },
            { id: 40, type: 'mcq', questionEn: 'What is a common method for resolving team conflicts?', questionAr: '', options: [{ id: 'a', textEn: 'Avoiding the issue' }, { id: 'b', textEn: 'Open communication' }, { id: 'c', textEn: 'Punishing team members' }, { id: 'd', textEn: 'Ignoring complaints' }], correctAnswer: 'b', marks: 1 },
            { id: 41, type: 'mcq', questionEn: 'What does the term "corporate culture" refer to?', questionAr: '', options: [{ id: 'a', textEn: 'The structure of the organization' }, { id: 'b', textEn: 'The shared values and beliefs within an organization' }, { id: 'c', textEn: 'The financial performance' }, { id: 'd', textEn: 'None of the above' }], correctAnswer: 'b', marks: 1 }
        ]
    },
    psych_basics: {
        id: 'psych_basics',
        title: 'Principles of Psychology',
        titleAr: 'مبادئ علم النفس',
        icon: '🧠',
        color: '#E91E63',
        questions: [
            {
                id: 1,
                type: 'tf',
                questionAr: 'ان الفهم هو من اهداف علم النفس',
                questionEn: 'Understanding is one of the goals of psychology',
                correctAnswer: true,
                marks: 1.0
            },
            {
                id: 2,
                type: 'tf',
                questionAr: 'ركز فرويد على اللاشعور',
                questionEn: 'Freud focused on the unconscious',
                correctAnswer: true,
                marks: 1.0
            },
            {
                id: 3,
                type: 'tf',
                questionAr: 'ان العلم نشاط موضوعي',
                questionEn: 'Science is an objective activity',
                correctAnswer: true,
                marks: 1.0
            },
            {
                id: 4,
                type: 'tf',
                questionAr: 'ان النفس هي الروح',
                questionEn: 'The soul is the spirit',
                correctAnswer: true,
                marks: 1.0
            },
            {
                id: 5,
                type: 'tf',
                questionAr: 'لا يمكن فصل الجسم عن العقل',
                questionEn: 'The body cannot be separated from the mind',
                correctAnswer: true,
                marks: 1.0
            }
        ]
    },
    applied_english_102: {
        id: 'applied_english_102',
        title: 'Applied English 102',
        titleAr: 'اللغة الإنجليزية التطبيقية 102',
        icon: '🇬🇧',
        color: '#3F51B5',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'In case of disaster, everyone should-------------------------- what he or she can afford.',
                options: [
                    { id: 'a', textEn: 'criticize' },
                    { id: 'b', textEn: 'contribute' },
                    { id: 'c', textEn: 'quarrel' },
                    { id: 'd', textEn: 'escalate' }
                ],
                correctAnswer: 'b',
                marks: 1
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'My sister--------------------------the windows yesterday because the weather--------very cold.',
                options: [
                    { id: 'a', textEn: 'didn\'t opened / was' },
                    { id: 'b', textEn: 'didn\'t open / was' },
                    { id: 'c', textEn: 'didn\'t open / were' },
                    { id: 'd', textEn: 'wasn\'t opening / was' }
                ],
                correctAnswer: 'b',
                marks: 1
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'My mother is a teacher. She --------------------- English language at a primary school in Jordan.',
                options: [
                    { id: 'a', textEn: 'teachs' },
                    { id: 'b', textEn: 'teaches' },
                    { id: 'c', textEn: 'teach' },
                    { id: 'd', textEn: 'taught' }
                ],
                correctAnswer: 'b',
                marks: 1
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'While Salma and I -------------------------, we suddenly felt sleepy',
                options: [
                    { id: 'a', textEn: 'were studying' },
                    { id: 'b', textEn: 'are studying' },
                    { id: 'c', textEn: 'am studying' },
                    { id: 'd', textEn: 'was studying' }
                ],
                correctAnswer: 'a',
                marks: 1
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'The doctor told my sister easier to lose weight if she has fast ----------------------.',
                options: [
                    { id: 'a', textEn: 'metabolism' },
                    { id: 'b', textEn: 'diabetes' },
                    { id: 'c', textEn: 'self-esteem' },
                    { id: 'd', textEn: 'disorder' }
                ],
                correctAnswer: 'a',
                marks: 1
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'A student in the second year of a course at a college or university is an / a / .----------------------------',
                options: [
                    { id: 'a', textEn: 'freshman' },
                    { id: 'b', textEn: 'junior' },
                    { id: 'c', textEn: 'senior' },
                    { id: 'd', textEn: 'sophomore' }
                ],
                correctAnswer: 'd',
                marks: 1
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'My friend visited many---------------------------but she still couldn’t stop eating junk.',
                options: [
                    { id: 'a', textEn: 'diseases' },
                    { id: 'b', textEn: 'disorders' },
                    { id: 'c', textEn: 'nutritionists' },
                    { id: 'd', textEn: 'potentials' }
                ],
                correctAnswer: 'c',
                marks: 1
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'The policeman ------------------my brother last night and ------------------his license.',
                options: [
                    { id: 'a', textEn: 'stopped / taked' },
                    { id: 'b', textEn: 'stoped / took' },
                    { id: 'c', textEn: 'stopped / took' },
                    { id: 'd', textEn: 'stopped / take' }
                ],
                correctAnswer: 'c',
                marks: 1
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'My brother is a pilot . He ---------- usually ---------his plane on Fridays.',
                options: [
                    { id: 'a', textEn: 'doesn\'t / flies' },
                    { id: 'b', textEn: 'don\'t / fly' },
                    { id: 'c', textEn: 'doesn\'t / fly' }
                ],
                correctAnswer: 'c',
                marks: 1
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'Did the new manager --------------------------French yesterday ? No, he .------------------------',
                options: [
                    { id: 'a', textEn: 'speak / didn\'t' },
                    { id: 'b', textEn: 'speaking / isn\'t' },
                    { id: 'c', textEn: 'spoke / didn\'t' },
                    { id: 'd', textEn: 'speaks / doen\'t' }
                ],
                correctAnswer: 'a',
                marks: 1
            }
        ]
    },
    comp_networks_1_p1: {
        id: 'comp_networks_1_p1',
        title: 'Computer Networks 1 - Part 1',
        titleAr: 'شبكات الحاسوب ١ - الجزء الأول',
        icon: '🌐',
        color: '#2196F3',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'What term is used to describe the Internet from a "nuts and bolts" perspective?', options: [{ id: 'a', textEn: 'A "network of networks"' }, { id: 'b', textEn: 'A protocol network' }, { id: 'c', textEn: 'A service provider network' }, { id: 'd', textEn: 'A single network' }], correctAnswer: 'a', marks: 1 },
            { id: 2, type: 'mcq', questionEn: 'What type of communication link uses copper, fiber, radio, and satellite?', options: [{ id: 'a', textEn: 'Transport link' }, { id: 'b', textEn: 'Data link' }, { id: 'c', textEn: 'Network link' }, { id: 'd', textEn: 'Communication link' }], correctAnswer: 'd', marks: 1 },
            { id: 3, type: 'mcq', questionEn: 'Which of the following is NOT a type of internet service provider (ISP)?', options: [{ id: 'a', textEn: 'National or global ISP' }, { id: 'b', textEn: 'Local or regional ISP' }, { id: 'c', textEn: 'Data center network' }, { id: 'd', textEn: 'Residential ISP' }], correctAnswer: 'c', marks: 1 },
            { id: 4, type: 'mcq', questionEn: 'What is the role of packet switches in a network?', options: [{ id: 'a', textEn: 'To establish physical connections' }, { id: 'b', textEn: 'To forward packets of data' }, { id: 'c', textEn: 'To encode and decode data' }, { id: 'd', textEn: 'To manage user access' }], correctAnswer: 'b', marks: 1 },
            { id: 5, type: 'mcq', questionEn: 'Which devices are considered to be at the network edge?', options: [{ id: 'a', textEn: 'Routers and switches' }, { id: 'b', textEn: 'Hosts (clients and servers)' }, { id: 'c', textEn: 'Protocol layers' }, { id: 'd', textEn: 'ISP backbones' }], correctAnswer: 'b', marks: 1 },
            { id: 6, type: 'mcq', questionEn: 'What type of network device is used to connect different networks and forward packets?', options: [{ id: 'a', textEn: 'Router' }, { id: 'b', textEn: 'Modem' }, { id: 'c', textEn: 'Switch' }, { id: 'd', textEn: 'Access point' }], correctAnswer: 'a', marks: 1 },
            { id: 7, type: 'mcq', questionEn: 'Which protocol is associated with web browsing?', options: [{ id: 'a', textEn: 'FTP' }, { id: 'b', textEn: 'SMTP' }, { id: 'c', textEn: 'HTTP' }, { id: 'd', textEn: 'DNS' }], correctAnswer: 'c', marks: 1 },
            { id: 8, type: 'mcq', questionEn: 'What does TCP stand for?', options: [{ id: 'a', textEn: 'Transmission Control Protocol' }, { id: 'b', textEn: 'Transfer Control Protocol' }, { id: 'c', textEn: 'Transmit Control Protocol' }, { id: 'd', textEn: 'Terminal Control Protocol' }], correctAnswer: 'a', marks: 1 },
            { id: 9, type: 'mcq', questionEn: 'What is the function of the Internet Engineering Task Force (IETF)?', options: [{ id: 'a', textEn: 'To create hardware for the internet' }, { id: 'b', textEn: 'To manage internet service providers' }, { id: 'c', textEn: 'To oversee data centers' }, { id: 'd', textEn: 'To develop and promote internet standards' }], correctAnswer: 'd', marks: 1 },
            { id: 10, type: 'mcq', questionEn: 'Which of the following is NOT a type of physical media for network transmission?', options: [{ id: 'a', textEn: 'Twisted pair' }, { id: 'b', textEn: 'Coaxial cable' }, { id: 'c', textEn: 'Fiber optic cable' }, { id: 'd', textEn: 'Network adapter' }], correctAnswer: 'd', marks: 1 },
            { id: 11, type: 'mcq', questionEn: 'What does DSL stand for?', options: [{ id: 'a', textEn: 'Digital subscriber line' }, { id: 'b', textEn: 'Digital Subscriber Line' }, { id: 'c', textEn: 'Direct Service Line' }, { id: 'd', textEn: 'Digital Signal Line' }], correctAnswer: 'a', marks: 1 },
            { id: 12, type: 'mcq', questionEn: 'Which of these is an example of a wireless access network?', options: [{ id: 'a', textEn: 'Ethernet' }, { id: 'b', textEn: 'WiFi' }, { id: 'c', textEn: 'Coaxial cable' }, { id: 'd', textEn: 'Fiber optic' }], correctAnswer: 'b', marks: 1 },
            { id: 13, type: 'mcq', questionEn: 'What is a key characteristic of circuit switching?', options: [{ id: 'a', textEn: 'Packet sharing' }, { id: 'b', textEn: 'Dedicated resources' }, { id: 'c', textEn: 'High error rate' }, { id: 'd', textEn: 'No need for connection setup' }], correctAnswer: 'b', marks: 1 },
            { id: 14, type: 'mcq', questionEn: 'What is the primary advantage of packet switching over circuit switching?', options: [{ id: 'a', textEn: 'Higher reliability' }, { id: 'b', textEn: 'Better error correction' }, { id: 'c', textEn: 'More efficient resource use' }, { id: 'd', textEn: 'Simpler implementation' }], correctAnswer: 'c', marks: 1 },
            { id: 15, type: 'mcq', questionEn: 'What is a packet in the context of networking?', options: [{ id: 'a', textEn: 'A fixed-length block of data' }, { id: 'b', textEn: 'A variable-length block of data' }, { id: 'c', textEn: 'A type of error-correcting code' }, { id: 'd', textEn: 'A protocol-specific message' }], correctAnswer: 'b', marks: 1 },
            { id: 16, type: 'mcq', questionEn: 'What is a common characteristic of fiber optic cables?', options: [{ id: 'a', textEn: 'High-speed transmission' }, { id: 'b', textEn: 'High error rate' }, { id: 'c', textEn: 'Low cost' }, { id: 'd', textEn: 'Easy installation' }], correctAnswer: 'a', marks: 1 },
            { id: 17, type: 'mcq', questionEn: 'What term describes the delay in data transmission?', options: [{ id: 'a', textEn: 'Latency' }, { id: 'b', textEn: 'Bandwidth' }, { id: 'c', textEn: 'Throughput' }, { id: 'd', textEn: 'Jitter' }], correctAnswer: 'a', marks: 1 },
            { id: 18, type: 'mcq', questionEn: 'What is the primary function of a router in a network?', options: [{ id: 'a', textEn: 'To convert data formats' }, { id: 'b', textEn: 'To manage network security' }, { id: 'c', textEn: 'To route data packets between networks' }, { id: 'd', textEn: 'To store data' }], correctAnswer: 'c', marks: 1 },
            { id: 19, type: 'mcq', questionEn: 'What does FDM stand for in networking?', options: [{ id: 'a', textEn: 'Frequency Division Multiplexing' }, { id: 'b', textEn: 'Frequency Data Modulation' }, { id: 'c', textEn: 'Frequency Division Method' }, { id: 'd', textEn: 'Frequency Data Management' }], correctAnswer: 'a', marks: 1 },
            { id: 20, type: 'mcq', questionEn: 'In what context is TDM used?', options: [{ id: 'a', textEn: 'Packet switching' }, { id: 'b', textEn: 'Network addressing' }, { id: 'c', textEn: 'Data encryption' }, { id: 'd', textEn: 'Circuit switching' }], correctAnswer: 'd', marks: 1 },
            { id: 21, type: 'mcq', questionEn: 'Which of the following is an example of a network core function?', options: [{ id: 'a', textEn: 'Data storage' }, { id: 'b', textEn: 'Forwarding packets' }, { id: 'c', textEn: 'User authentication' }, { id: 'd', textEn: 'Content delivery' }], correctAnswer: 'b', marks: 1 },
            { id: 22, type: 'mcq', questionEn: 'What type of network connection is typically used within an enterprise?', options: [{ id: 'a', textEn: 'DSL' }, { id: 'b', textEn: 'Cable modem' }, { id: 'c', textEn: 'Ethernet' }, { id: 'd', textEn: 'Satellite' }], correctAnswer: 'c', marks: 1 }
        ]
    },
    comp_networks_1_p2: {
        id: 'comp_networks_1_p2',
        title: 'Computer Networks 1 - Part 2',
        titleAr: 'شبكات الحاسوب ١ - الجزء الثاني',
        icon: '🌐',
        color: '#4CAF50',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'Why is layering important in designing complex systems?', options: [{ id: 'a', textEn: 'It allows for identification and relationship of system\'s pieces' }, { id: 'b', textEn: 'It makes the system more confusing' }, { id: 'c', textEn: 'It doesn\'t affect the system at all' }, { id: 'd', textEn: 'It is unnecessary' }], correctAnswer: 'a', marks: 1 },
            { id: 2, type: 'mcq', questionEn: 'What is the benefit of modularization in a layered system?', options: [{ id: 'a', textEn: 'It makes maintenance easier' }, { id: 'b', textEn: 'It makes maintenance harder' }, { id: 'c', textEn: 'It doesn\'t affect maintenance' }, { id: 'd', textEn: 'It is unnecessary' }], correctAnswer: 'a', marks: 1 },
            { id: 3, type: 'mcq', questionEn: 'How does a change in a layer\'s service implementation affect the rest of the system?', options: [{ id: 'a', textEn: 'It is transparent to the rest of the system' }, { id: 'b', textEn: 'It breaks the system' }, { id: 'c', textEn: 'It improves the system' }, { id: 'd', textEn: 'It doesn\'t affect the system' }], correctAnswer: 'a', marks: 1 },
            { id: 4, type: 'mcq', questionEn: 'Which layer of the Internet protocol stack is responsible for supporting network applications?', options: [{ id: 'a', textEn: 'Application' }, { id: 'b', textEn: 'Transport' }, { id: 'c', textEn: 'Network' }, { id: 'd', textEn: 'Link' }], correctAnswer: 'a', marks: 1 },
            { id: 5, type: 'mcq', questionEn: 'Which layer of the Internet protocol stack is responsible for routing datagrams?', options: [{ id: 'a', textEn: 'Application' }, { id: 'b', textEn: 'Transport' }, { id: 'c', textEn: 'Network' }, { id: 'd', textEn: 'Link' }], correctAnswer: 'c', marks: 1 },
            { id: 6, type: 'mcq', questionEn: 'What is encapsulation in the context of layering and services?', options: [{ id: 'a', textEn: 'It involves encapsulating messages with headers' }, { id: 'b', textEn: 'It involves breaking down messages into smaller parts' }, { id: 'c', textEn: 'It involves encrypting messages' }, { id: 'd', textEn: 'It is not relevant to layering' }], correctAnswer: 'a', marks: 1 },
            { id: 7, type: 'mcq', questionEn: 'What analogy is used to explain encapsulation?', options: [{ id: 'a', textEn: 'Stacking dolls' }, { id: 'b', textEn: 'Jigsaw puzzles' }, { id: 'c', textEn: 'Building blocks' }, { id: 'd', textEn: 'None of the above' }], correctAnswer: 'a', marks: 1 },
            { id: 8, type: 'mcq', questionEn: 'How does a network-layer protocol transfer a transport-layer segment?', options: [{ id: 'a', textEn: 'By encapsulating it with a network-layer header' }, { id: 'b', textEn: 'By breaking it down into smaller parts' }, { id: 'c', textEn: 'By encrypting it' }, { id: 'd', textEn: 'By compressing it' }], correctAnswer: 'a', marks: 1 },
            { id: 9, type: 'mcq', questionEn: 'What is the purpose of a link-layer frame?', options: [{ id: 'a', textEn: 'To transfer datagrams between neighboring hosts' }, { id: 'b', textEn: 'To encrypt data' }, { id: 'c', textEn: 'To compress data' }, { id: 'd', textEn: 'To break down data into smaller parts' }], correctAnswer: 'a', marks: 1 },
            { id: 10, type: 'mcq', questionEn: 'How does a link-layer protocol encapsulate a network datagram?', options: [{ id: 'a', textEn: 'With a link-layer header' }, { id: 'b', textEn: 'With a network-layer header' }, { id: 'c', textEn: 'With a transport-layer header' }, { id: 'd', textEn: 'With an application-layer header' }], correctAnswer: 'a', marks: 1 }
        ]
    },
    os_mid: {
        id: 'os_mid',
        title: 'Operating Systems - Mid Exam',
        titleAr: 'نظم تشغيل للهندسة - مادة الميد',
        icon: '⚙️',
        color: '#FF5722',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'What is the core component of an OS that manages processes and memory?',
                options: [
                    { id: 'a', textEn: 'User Interface (GUI)' },
                    { id: 'b', textEn: 'Kernel' },
                    { id: 'c', textEn: 'File System' },
                    { id: 'd', textEn: 'Compiler' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Which of the following is NOT a standard process state?',
                options: [
                    { id: 'a', textEn: 'Ready' },
                    { id: 'b', textEn: 'Running' },
                    { id: 'c', textEn: 'Deleted' },
                    { id: 'd', textEn: 'Waiting' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'The process of switching the CPU from one process to another is called:',
                options: [
                    { id: 'a', textEn: 'Process Scheduling' },
                    { id: 'b', textEn: 'Context Switching' },
                    { id: 'c', textEn: 'Multitasking' },
                    { id: 'd', textEn: 'Threading' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'The scheduling algorithm that serves the process that arrives first is:',
                options: [
                    { id: 'a', textEn: 'SJF' },
                    { id: 'b', textEn: 'Round Robin' },
                    { id: 'c', textEn: 'FCFS' },
                    { id: 'd', textEn: 'Priority Scheduling' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'What is "Starvation" in process scheduling?',
                options: [
                    { id: 'a', textEn: 'Process stopping work' },
                    { id: 'b', textEn: 'Low priority process never getting CPU' },
                    { id: 'c', textEn: 'Lack of RAM' },
                    { id: 'd', textEn: 'Slow CPU speed' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'A small program that loads the OS during startup is called:',
                options: [
                    { id: 'a', textEn: 'BIOS' },
                    { id: 'b', textEn: 'Bootstrap Loader' },
                    { id: 'c', textEn: 'Safe Mode' },
                    { id: 'd', textEn: 'Terminal' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Which of the following is an open-source OS?',
                options: [
                    { id: 'a', textEn: 'Windows' },
                    { id: 'b', textEn: 'Linux' },
                    { id: 'c', textEn: 'macOS' },
                    { id: 'd', textEn: 'iOS' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            }
        ]
    },
    os_final: {
        id: 'os_final',
        title: 'Operating Systems - Final Exam',
        titleAr: 'نظم تشغيل للهندسة - مادة الفاينل',
        icon: '⚙️',
        color: '#FF5722',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'In compare_and_swap(value, expected, new_value), the update occurs only if:',
                options: [
                    { id: 'a', textEn: 'expected == new_value' },
                    { id: 'b', textEn: '*value == new_value' },
                    { id: 'c', textEn: 'value is zero' },
                    { id: 'd', textEn: '*value == expected' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Mutex locks rely on:',
                options: [
                    { id: 'a', textEn: 'Preemptive scheduling' },
                    { id: 'b', textEn: 'Signals' },
                    { id: 'c', textEn: 'Atomic hardware instructions' },
                    { id: 'd', textEn: 'Shared memory' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'What is the danger of calling wait(mutex) twice without a signal()?',
                options: [
                    { id: 'a', textEn: 'Deadlock' },
                    { id: 'b', textEn: 'Race condition' },
                    { id: 'c', textEn: 'Progress violation' },
                    { id: 'd', textEn: 'Infinite loop' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'In a monitor, the synchronization between threads is achieved using:',
                options: [
                    { id: 'a', textEn: 'External variables' },
                    { id: 'b', textEn: 'Internal condition variables' },
                    { id: 'c', textEn: 'Shared global variables' },
                    { id: 'd', textEn: 'Busy waiting' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'What happens in a bounded-waiting implementation using compare-and-swap if all processes are waiting?',
                options: [
                    { id: 'a', textEn: 'One enters at random' },
                    { id: 'b', textEn: 'The next eligible process is selected in order' },
                    { id: 'c', textEn: 'All processes enter together' },
                    { id: 'd', textEn: 'Deadlock occurs' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'For a Resource Allocation Graph with cycles: R1→T1→R2→T2→R1 and R3→T2→R2→T3→R3. How many cycles cause the deadlock?',
                options: [
                    { id: 'a', textEn: '3' },
                    { id: 'b', textEn: '4' },
                    { id: 'c', textEn: '2' },
                    { id: 'd', textEn: '1' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'System has 5 threads (T0-T4) and resources A(10), B(5), C(7). Allocation: T0(0,1,0), T1(2,0,0), T2(3,0,2), T3(2,1,1), T4(0,0,2). What are the Available resources?',
                options: [
                    { id: 'a', textEn: '(3, 4, 2)' },
                    { id: 'b', textEn: '(4, 3, 2)' },
                    { id: 'c', textEn: '(3, 3, 3)' },
                    { id: 'd', textEn: '(3, 3, 2)' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Based on the previous data (Max for T4: 4,3,3 and Alloc for T4: 0,0,2), what is the "Need" matrix for process T4?',
                options: [
                    { id: 'a', textEn: '(4, 3, 1)' },
                    { id: 'b', textEn: '(0, 0, 2)' },
                    { id: 'c', textEn: '(3, 3, 2)' },
                    { id: 'd', textEn: '(4, 2, 1)' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Assume Available is (0, 2, 2). Which process can safely execute immediately if Needs are: T0(7,4,3), T1(1,2,2), T2(6,0,0), T3(0,1,1), T4(4,3,1)?',
                options: [
                    { id: 'a', textEn: 'T0 only' },
                    { id: 'b', textEn: 'T3 only' },
                    { id: 'c', textEn: 'T2 only' },
                    { id: 'd', textEn: 'T4 only' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'If process T1 requests (1, 0, 2) when Available is (3, 3, 2) and its Need is (1, 2, 2), should the system grant it immediately?',
                options: [
                    { id: 'a', textEn: 'Yes, the system remains in a safe state' },
                    { id: 'b', textEn: 'No, it will cause deadlock' },
                    { id: 'c', textEn: 'Cannot determine without Max values' },
                    { id: 'd', textEn: 'It will block the system indefinitely' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 11,
                type: 'mcq',
                questionEn: 'Which of the following is a possible safe sequence of execution for the given system?',
                options: [
                    { id: 'a', textEn: 'T3 -> T1 -> T4 -> T0 -> T2' },
                    { id: 'b', textEn: 'T2 -> T0 -> T1 -> T4 -> T3' },
                    { id: 'c', textEn: 'T4 -> T3 -> T2 -> T1 -> T0' },
                    { id: 'd', textEn: 'T1 -> T2 -> T4 -> T3 -> T0' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 12,
                type: 'mcq',
                questionEn: 'If process T2 requests (4,0,1) but its Need for resource C is only 0, should it be granted immediately?',
                options: [
                    { id: 'a', textEn: 'Yes, because available is enough' },
                    { id: 'b', textEn: 'No, because the system enters an unsafe state' },
                    { id: 'c', textEn: 'Yes, because total resource is sufficient' },
                    { id: 'd', textEn: 'No, because the request is more than the need' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 13,
                type: 'mcq',
                questionEn: 'Deadlock Detection: System has Available(0,0,0). Allocations: T0(0,1,0), T1(2,0,0), T3(2,1,1). Requests: T0(0,0,0), T1(2,0,2), T2(0,0,0), T3(1,0,0). Which processes can complete immediately?',
                options: [
                    { id: 'a', textEn: 'T1 only' },
                    { id: 'b', textEn: 'T0 and T2 only' },
                    { id: 'c', textEn: 'T3 and T4 only' },
                    { id: 'd', textEn: 'All processes' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 14,
                type: 'mcq',
                questionEn: 'After T0 and T2 (with Allocations 0,1,0 and 3,0,3) complete, what will be the new Available resources if starting from (0,0,0)?',
                options: [
                    { id: 'a', textEn: '(5, 1, 3)' },
                    { id: 'b', textEn: '(3, 1, 3)' },
                    { id: 'c', textEn: '(6, 1, 3)' },
                    { id: 'd', textEn: '(7, 2, 6)' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 15,
                type: 'mcq',
                questionEn: 'With updated Available = (2,0,3), and Requests T1(2,0,2), T3(1,0,0), T4(0,0,2), which process can now complete?',
                options: [
                    { id: 'a', textEn: 'T1 only' },
                    { id: 'b', textEn: 'T3 only' },
                    { id: 'c', textEn: 'T4 only' },
                    { id: 'd', textEn: 'All processes can run now' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 16,
                type: 'mcq',
                questionEn: 'A system has Available(3,1,3). T1 requests (5,0,2), while T3 and T4 can complete using current resources. What should the system do?',
                options: [
                    { id: 'a', textEn: 'Grant T1\'s request immediately' },
                    { id: 'b', textEn: 'Deny T1\'s request and allow T3 and T4 to complete' },
                    { id: 'c', textEn: 'Terminate T1 to free its resources' },
                    { id: 'd', textEn: 'Block all processes until T1\'s request is fulfilled' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 17,
                type: 'mcq',
                questionEn: 'Which of the following correctly represents the behavior of a test_and_set function?',
                options: [
                    { id: 'a', textEn: 'lock = 1;' },
                    { id: 'b', textEn: 'compare_and_swap(&lock, 1, 0)' },
                    { id: 'c', textEn: 'compare_and_swap(&lock, 0, 1)' },
                    { id: 'd', textEn: 'if (lock == 0) lock = 1;' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 18,
                type: 'mcq',
                questionEn: 'If Hyper-Threading is enabled, how many kernel threads will be available if the CPU has 4 cores?',
                options: [
                    { id: 'a', textEn: '4' },
                    { id: 'b', textEn: '6' },
                    { id: 'c', textEn: '8' },
                    { id: 'd', textEn: '16' }
                ],
                correctAnswer: 'c',
                marks: 2.0
            },
            {
                id: 19,
                type: 'mcq',
                questionEn: 'What is the difference between i++ and atomic increment (atomic i++)?',
                options: [
                    { id: 'a', textEn: 'There is no difference; both produce the same result' },
                    { id: 'b', textEn: 'i++ is faster because it is a single CPU instruction' },
                    { id: 'c', textEn: 'Atomic increment can only be used in single-threaded programs' },
                    { id: 'd', textEn: 'i++ is not thread-safe, while atomic increment is thread-safe and guarantees correct results' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 20,
                type: 'mcq',
                questionEn: 'Which option correctly states the three requirements of a correct solution to the critical-section problem?',
                options: [
                    { id: 'a', textEn: 'Mutual Exclusion, Immediate Entry, Same Process Speed' },
                    { id: 'b', textEn: 'Mutual Exclusion, Progress, Bounded Waiting' },
                    { id: 'c', textEn: 'Shared Access, Priority Scheduling, No Waiting Limit' },
                    { id: 'd', textEn: 'Mutual Exclusion, Speed Dependency, Starvation' }
                ],
                correctAnswer: 'b',
            }
        ]
    },
    military_science_mid: {
        id: 'military_science_mid',
        title: 'Mid Exam',
        titleAr: 'مادة الميد',
        icon: '🎖️',
        color: '#5D4037',
        parts: [
            { id: 'military_science_mid_p1', title: 'Part 1', titleAr: 'الجزء الأول (20 سؤال)' },
            { id: 'military_science_mid_p2', title: 'Part 2', titleAr: 'الجزء الثاني (20 سؤال)' },
            { id: 'military_science_mid_p3', title: 'Part 3', titleAr: 'الجزء الثالث (20 سؤال)' },
            { id: 'military_science_mid_p4', title: 'Part 4', titleAr: 'الجزء الرابع (20 سؤال)' },
            { id: 'military_science_mid_p5', title: 'Part 5', titleAr: 'الجزء الخامس (الأسئلة المتبقية)' }
        ]
    },
    military_science_final: {
        id: 'military_science_final',
        title: 'Final Exam',
        titleAr: 'مادة الفاينل',
        icon: '🎖️',
        color: '#5D4037',
        questions: []
    },
    military_science_mid_p1: {
        id: 'military_science_mid_p1',
        title: 'Mid Exam - Part 1',
        titleAr: 'مادة الميد - الجزء الأول',
        icon: '🎖️',
        color: '#5D4037',
        questions: [
            { id: 1, type: 'mcq', questionAr: 'رتبة جندي أول من الرتب الأخرى الأفراد وتتمثل بـ:', options: [{ id: 'a', textAr: 'شريطة على الذراع' }, { id: 'b', textAr: 'التاج الهاشمي على الذراع' }, { id: 'c', textAr: 'شريطتان على الذراع' }, { id: 'd', textAr: 'ثلاث شرائط على الذراع' }], correctAnswer: 'a', marks: 1 },
            { id: 2, type: 'mcq', questionAr: 'تأسست قيادة القوة البحرية والزوارق الملكية عام:', options: [{ id: 'a', textAr: '1951' }, { id: 'b', textAr: '1950' }, { id: 'c', textAr: '1946' }, { id: 'd', textAr: '1977' }], correctAnswer: 'a', marks: 1 },
            { id: 3, type: 'mcq', questionAr: 'سيد المعركة الذي يمسك الأرض ويطهرها ويحتفظ بها هو جندي:', options: [{ id: 'a', textAr: 'اللاسلكي' }, { id: 'b', textAr: 'المدفعية' }, { id: 'c', textAr: 'الدروع' }, { id: 'd', textAr: 'المشاة' }], correctAnswer: 'd', marks: 1 },
            { id: 4, type: 'mcq', questionAr: 'تم تشكيل نواة سلاح الجو الملكي في عهد جلالة:', options: [{ id: 'a', textAr: 'الملك المؤسس' }, { id: 'b', textAr: 'الملك طلال' }, { id: 'c', textAr: 'الملك حسين' }, { id: 'd', textAr: 'الملك عبدالله الثاني' }], correctAnswer: 'a', marks: 1 },
            { id: 5, type: 'mcq', questionAr: 'من أنواع الدفاع الجوي:', options: [{ id: 'a', textAr: 'الدفاع الجوي المركزي (سلاح الجو)' }, { id: 'b', textAr: 'راجمات الصواريخ' }, { id: 'c', textAr: 'قوات المظليين' }, { id: 'd', textAr: 'الذخائر' }], correctAnswer: 'a', marks: 1 },
            { id: 6, type: 'mcq', questionAr: 'يرأس دائرة المخابرات العامة مدير عام يتم تعيينه وعزله من قبل:', options: [{ id: 'a', textAr: 'جلالة الملك المعظم' }, { id: 'b', textAr: 'رئيس الوزراء بأوامر خطية' }, { id: 'c', textAr: 'مجلس الأعيان' }, { id: 'd', textAr: 'رئيس الوزراء ورئيس مجلس النواب' }], correctAnswer: 'a', marks: 1 },
            { id: 7, type: 'mcq', questionAr: 'من مصادر تجنيد الأفراد (الرتب الأخرى) في القوات المسلحة الأردنية:', options: [{ id: 'a', textAr: 'المتطوعون عن طريق مديرية شؤون الضباط' }, { id: 'b', textAr: 'المتطوعون عن طريق مديرية شؤون الأفراد' }, { id: 'c', textAr: 'جامعة مؤتة' }, { id: 'd', textAr: 'كلية الأمير حسن للعلوم الإسلامية' }], correctAnswer: 'b', marks: 1 },
            { id: 8, type: 'mcq', questionAr: 'من أبرز ملامح مرحلة التميز الوطني والدور الإقليمي في مسيرة الخدمات الطبية الملكية:', options: [{ id: 'a', textAr: 'إنشاء مركز الملكة علياء لأمراض وجراحة القلب' }, { id: 'b', textAr: 'إقرار مشروع معالجة العائلات' }, { id: 'c', textAr: 'افتتاح مدينة الحسين الطبية' }, { id: 'd', textAr: 'افتتاح مستشفى اللطرون العسكري' }], correctAnswer: 'a', marks: 1 },
            { id: 9, type: 'mcq', questionAr: 'ترمز الكرة الأرضية في شعار المملكة الأردنية الهاشمية إلى:', options: [{ id: 'a', textAr: 'النظام الملكي' }, { id: 'b', textAr: 'راية الثورة العربية الكبرى' }, { id: 'c', textAr: 'انتشار الإسلام وحضارته في العالم' }, { id: 'd', textAr: 'الفداء والتضحية' }], correctAnswer: 'c', marks: 1 },
            { id: 10, type: 'mcq', questionAr: 'بدأ استخدام العلم الأردني بصورته الحالية منذ:', options: [{ id: 'a', textAr: 'استقلال المملكة عام 1946' }, { id: 'b', textAr: 'تأسيس إمارة شرق الأردن عام 1921' }, { id: 'c', textAr: 'تشكيل أول حكومة أردنية' }, { id: 'd', textAr: 'إعلان الثورة العربية الكبرى' }], correctAnswer: 'b', marks: 1 },
            { id: 11, type: 'mcq', questionAr: 'من أدوار المواطن في الحفاظ على أمن الوطن:', options: [{ id: 'a', textAr: 'التعاون مع التنظيمات المحظورة' }, { id: 'b', textAr: 'إذاعة الشائعة' }, { id: 'c', textAr: 'رفض التطرف مهما كان مصدره' }, { id: 'd', textAr: 'البوح بأسرار البلد' }], correctAnswer: 'c', marks: 1 },
            { id: 12, type: 'mcq', questionAr: 'أصدر جلالة الملك الحسين بن طلال بعد حرب الخليج الثانية كتاب بعنوان:', options: [{ id: 'a', textAr: 'مهنتي كملك' }, { id: 'b', textAr: 'أحاديث ملكية' }, { id: 'c', textAr: 'الكتاب الأبيض' }, { id: 'd', textAr: 'الحرب العراقية الإيرانية' }], correctAnswer: 'c', marks: 1 },
            { id: 13, type: 'mcq', questionAr: 'إدامة الاتصالات اللازمة لنقل الصوت والصورة والمعلومات من واجبات:', options: [{ id: 'a', textAr: 'أسلحة المناورة' }, { id: 'b', textAr: 'أسلحة الإسناد' }, { id: 'c', textAr: 'سلاح اللاسلكي الملكي' }, { id: 'd', textAr: 'سلاح الهندسة الملكي' }], correctAnswer: 'c', marks: 1 },
            { id: 14, type: 'mcq', questionAr: 'أطلق الشريف الحسين بن علي رصاصة الثورة العربية الكبرى من:', options: [{ id: 'a', textAr: 'مكة المكرمة 1916' }, { id: 'b', textAr: 'مكة المكرمة 1917' }, { id: 'c', textAr: 'المدينة المنورة 1917' }, { id: 'd', textAr: 'عمان 1916' }], correctAnswer: 'a', marks: 1 },
            { id: 15, type: 'mcq', questionAr: 'السيطرة على المزارعين والصيادين والرعاة ضمن مناطق المسؤولية من واجبات:', options: [{ id: 'a', textAr: 'وحدات حرس الحدود' }, { id: 'b', textAr: 'سلاح الهندسة الملكي' }, { id: 'c', textAr: 'مؤسسة الإسكان والأشغال العسكرية' }, { id: 'd', textAr: 'المركز العسكري لمكافحة الإرهاب' }], correctAnswer: 'a', marks: 1 },
            { id: 16, type: 'mcq', questionAr: 'من واجبات سلاح الهندسة الملكي:', options: [{ id: 'a', textAr: 'المساعدة في أعمال التخفية والتمويه' }, { id: 'b', textAr: 'تأمين البريد العسكري' }, { id: 'c', textAr: 'تقديم الإسناد الفني' }, { id: 'd', textAr: 'السيطرة على اللجوء غير الشرعي' }], correctAnswer: 'a', marks: 1 },
            { id: 17, type: 'mcq', questionAr: 'إدامة القوات المسلحة بجميع ما تحتاجه من أرزاق ووقود ونقل من واجبات:', options: [{ id: 'a', textAr: 'المركز الوطني لإدارة الأزمات' }, { id: 'b', textAr: 'وزارة النقل' }, { id: 'c', textAr: 'التموين والنقل الملكي' }, { id: 'd', textAr: 'المركز الأردني للتصميم' }], correctAnswer: 'c', marks: 1 },
            { id: 18, type: 'mcq', questionAr: 'تسمى الاتفاقية التي وقعتها فرنسا وبريطانيا عام 1916:', options: [{ id: 'a', textAr: 'سايكس بيكو' }, { id: 'b', textAr: 'وعد بلفور' }, { id: 'c', textAr: 'الحسين مكماهون' }, { id: 'd', textAr: 'فرساي' }], correctAnswer: 'a', marks: 1 },
            { id: 19, type: 'mcq', questionAr: 'ضمن إدارات الأمن العام، تعمل الشرطة النسائية في:', options: [{ id: 'a', textAr: 'إدارة السير والمختبرات الجنائية' }, { id: 'b', textAr: 'مدارس الثقافة العسكرية' }, { id: 'c', textAr: 'التصوير الجوي' }, { id: 'd', textAr: 'الإنزال الجوي' }], correctAnswer: 'a', marks: 1 },
            { id: 20, type: 'mcq', questionAr: 'مواجهة الحملات الإعلامية غير التقليدية من إمكانيات:', options: [{ id: 'a', textAr: 'المركز الوطني للأمن وإدارة الأزمات' }, { id: 'b', textAr: 'مديرية الإفتاء العسكري' }, { id: 'c', textAr: 'الهيئة الهاشمية للمصابين' }, { id: 'd', textAr: 'المركز العسكري لمكافحة الإرهاب' }], correctAnswer: 'd', marks: 1 }
        ]
    },
    military_science_mid_p2: {
        id: 'military_science_mid_p2',
        title: 'Mid Exam - Part 2',
        titleAr: 'مادة الميد - الجزء الثاني',
        icon: '🎖️',
        color: '#5D4037',
        questions: [
            { id: 21, type: 'mcq', questionAr: 'الوحدة المعنية بتأمين المواد والحاجات اليومية للوحدات هي:', options: [{ id: 'a', textAr: 'سلاح الهندسة' }, { id: 'b', textAr: 'وحدات الخدمات' }, { id: 'c', textAr: 'سلاح اللاسلكي' }, { id: 'd', textAr: 'المشاة والدروع' }], correctAnswer: 'b', marks: 1 },
            { id: 22, type: 'mcq', questionAr: 'أهمية مشاركة الأردن في حرب 1973 تمثلت بـ:', options: [{ id: 'a', textAr: 'إشغال جزء من القوات الإسرائيلية' }, { id: 'b', textAr: 'اختراق دفاعات العدو في العراق' }, { id: 'c', textAr: 'حرمان العدو من الالتفاف على القوات المصرية' }, { id: 'd', textAr: 'استخدام الأراضي المصرية' }], correctAnswer: 'a', marks: 1 },
            { id: 23, type: 'mcq', questionAr: 'أعلن الشريف الحسين بن علي الثورة العربية الكبرى عام:', options: [{ id: 'a', textAr: '1948' }, { id: 'b', textAr: '1916' }, { id: 'c', textAr: '1918' }, { id: 'd', textAr: '1999' }], correctAnswer: 'b', marks: 1 },
            { id: 24, type: 'mcq', questionAr: 'بناء قوات مسلحة نظامية حديثة هدف من أهداف الثورة العربية الكبرى:', options: [{ id: 'a', textAr: 'العسكرية' }, { id: 'b', textAr: 'السياسية' }, { id: 'c', textAr: 'النفسية والمعنوية' }, { id: 'd', textAr: 'الاقتصادية' }], correctAnswer: 'a', marks: 1 },
            { id: 25, type: 'mcq', questionAr: 'السيطرة على اللجوء غير الشرعي من واجبات:', options: [{ id: 'a', textAr: 'وحدات حرس الحدود' }, { id: 'b', textAr: 'سلاح الهندسة الملكي' }, { id: 'c', textAr: 'سلاح المشاة' }, { id: 'd', textAr: 'سلاح الجو' }], correctAnswer: 'a', marks: 1 },
            { id: 26, type: 'mcq', questionAr: 'تضطلع دائرة المخابرات العامة بمهماتها من خلال:', options: [{ id: 'a', textAr: 'الالتزام بقوانين الدول الأخرى' }, { id: 'b', textAr: 'جمع وتحليل المعلومات' }, { id: 'c', textAr: 'العمل التشاركي الدولي' }, { id: 'd', textAr: 'احترام حقوق الدول' }], correctAnswer: 'b', marks: 1 },
            { id: 27, type: 'mcq', questionAr: 'المكتب السياسي للتحقيقات مهمته الأساسية:', options: [{ id: 'a', textAr: 'الإشراف على التجمعات' }, { id: 'b', textAr: 'منع الجرائم وتعقبها' }, { id: 'c', textAr: 'حفظ أمن القوات المسلحة' }, { id: 'd', textAr: 'مكافحة التهريب' }], correctAnswer: 'b', marks: 1 },
            { id: 28, type: 'mcq', questionAr: 'تم افتتاح مدينة الحسين الطبية واستقبال أول مريض عام:', options: [{ id: 'a', textAr: '1973' }, { id: 'b', textAr: '1975' }, { id: 'c', textAr: '1946' }, { id: 'd', textAr: '1977' }], correctAnswer: 'a', marks: 1 },
            { id: 29, type: 'mcq', questionAr: 'في عام 1955 تم تزويد سلاح الجو بطائرات الفامبير وسمي بـ:', options: [{ id: 'a', textAr: 'طيران المملكة الأردنية' }, { id: 'b', textAr: 'سلاح الجو الملكي الأردني' }, { id: 'c', textAr: 'القوات الجوية القتالية' }, { id: 'd', textAr: 'القوات الجوية الميدانية' }], correctAnswer: 'b', marks: 1 },
            { id: 30, type: 'mcq', questionAr: 'السلاح الذي واكب تطور القوات المسلحة منذ 1921 هو:', options: [{ id: 'a', textAr: 'سلاح الهندسة' }, { id: 'b', textAr: 'سلاح المفارز الفنية' }, { id: 'c', textAr: 'الكلية الفنية العسكرية' }, { id: 'd', textAr: 'سلاح الصيانة الملكي' }], correctAnswer: 'a', marks: 1 },
            { id: 31, type: 'mcq', questionAr: 'رقعة نسيج متعددة الألوان تمثل الشخصية الاعتبارية للدولة هي:', options: [{ id: 'a', textAr: 'العلم الوطني' }, { id: 'b', textAr: 'شعار الدولة' }, { id: 'c', textAr: 'الراية الهاشمية' }, { id: 'd', textAr: 'شعار الجيش' }], correctAnswer: 'a', marks: 1 },
            { id: 32, type: 'mcq', questionAr: 'بويع جلالة الملك عبدالله الثاني ملكًا عام:', options: [{ id: 'a', textAr: '1999' }, { id: 'b', textAr: '1992' }, { id: 'c', textAr: '1996' }, { id: 'd', textAr: '1955' }], correctAnswer: 'a', marks: 1 },
            { id: 33, type: 'mcq', questionAr: 'استمر تطوير الدبابات من حيث:', options: [{ id: 'a', textAr: 'العمق للقتال' }, { id: 'b', textAr: 'العمليات التعبوية' }, { id: 'c', textAr: 'إسناد الخدمات الطبية' }, { id: 'd', textAr: 'قوة النار والحركة والتدريع' }], correctAnswer: 'd', marks: 1 },
            { id: 34, type: 'mcq', questionAr: 'تأسست جامعة مؤتة / الجناح العسكري بهدف:', options: [{ id: 'a', textAr: 'رفد السوق بكوادر مهنية' }, { id: 'b', textAr: 'إعداد ضباط مؤهلين' }, { id: 'c', textAr: 'تحسين الاقتصاد' }, { id: 'd', textAr: 'رفع تدريب أبناء العاملين' }], correctAnswer: 'b', marks: 1 },
            { id: 35, type: 'mcq', questionAr: 'سيفان متقاطعان ونجمة سباعية وياقتان حمراوان هي رتبة:', options: [{ id: 'a', textAr: 'فريق' }, { id: 'b', textAr: 'عقيد' }, { id: 'c', textAr: 'لواء' }, { id: 'd', textAr: 'مشير' }], correctAnswer: 'a', marks: 1 },
            { id: 36, type: 'mcq', questionAr: 'المشاة المنقولة جوًا نوع من أنواع سلاح:', options: [{ id: 'a', textAr: 'الهندسة' }, { id: 'b', textAr: 'الدروع' }, { id: 'c', textAr: 'المشاة' }, { id: 'd', textAr: 'الدفاع الجوي' }], correctAnswer: 'c', marks: 1 },
            { id: 37, type: 'mcq', questionAr: 'تعلو الحرية رأس التاج في شعار المملكة وترمز إلى:', options: [{ id: 'a', textAr: 'قوة الجيش' }, { id: 'b', textAr: 'حرية راية الهاشميين' }, { id: 'c', textAr: 'تاريخ الهاشميين' }, { id: 'd', textAr: 'عزة النفس العربية' }], correctAnswer: 'b', marks: 1 },
            { id: 38, type: 'mcq', questionAr: 'مفهوم الدفاع الجوي يعني:', options: [{ id: 'a', textAr: 'حماية الأرض من سلاح الجو المعادي' }, { id: 'b', textAr: 'سلاح المدفعية' }, { id: 'c', textAr: 'سلاح الهندسة' }, { id: 'd', textAr: 'سلاح اللاسلكي' }], correctAnswer: 'a', marks: 1 },
            { id: 39, type: 'mcq', questionAr: 'من واجبات الدفاع الجوي:', options: [{ id: 'a', textAr: 'التجريد والاستطلاع الجوي' }, { id: 'b', textAr: 'الإنزال الجوي' }, { id: 'c', textAr: 'الدفاع عن المناطق الحيوية' }, { id: 'd', textAr: 'الاستطلاع البحري' }], correctAnswer: 'c', marks: 1 },
            { id: 40, type: 'mcq', questionAr: 'حماية حدود المملكة ومنع التسلل من مهام:', options: [{ id: 'a', textAr: 'سلاح الهندسة' }, { id: 'b', textAr: 'وحدات حرس الحدود' }, { id: 'c', textAr: 'سلاح الصيانة' }, { id: 'd', textAr: 'القوة البحرية' }], correctAnswer: 'b', marks: 1 }
        ]
    },
    military_science_mid_p3: {
        id: 'military_science_mid_p3',
        title: 'Mid Exam - Part 3',
        titleAr: 'مادة الميد - الجزء الثالث',
        icon: '🎖️',
        color: '#5D4037',
        questions: [
            { id: 41, type: 'mcq', questionAr: 'رؤية الخدمات الطبية الملكية هي:', options: [{ id: 'a', textAr: 'الصدارة في تقديم خدمة طبية للقطاع الخاص فقط' }, { id: 'b', textAr: 'تقديم خدمة لأبناء العاملين فقط' }, { id: 'c', textAr: 'معالجة القطاع الخاص' }, { id: 'd', textAr: 'الصدارة في تقديم خدمة طبية متكاملة متميزة تواكب التقدم الطبي العالمي' }], correctAnswer: 'd', marks: 1 },
            { id: 42, type: 'mcq', questionAr: 'من أكثر الصنوف سرعة في التطور والتحديث:', options: [{ id: 'a', textAr: 'العمليات التعبوية' }, { id: 'b', textAr: 'وحدات الخدمات' }, { id: 'c', textAr: 'قوات الصاعقة' }, { id: 'd', textAr: 'الوحدات المدرعة' }], correctAnswer: 'a', marks: 1 },
            { id: 43, type: 'mcq', questionAr: 'ظهرت الحاجة إلى وجود مستشفى للجيش العربي عام 1948 حيث تم تخصيص:', options: [{ id: 'a', textAr: 'مراكز صحية في المدن' }, { id: 'b', textAr: 'تكنات قوة حدود شرق الأردن' }, { id: 'c', textAr: 'مديرية الإعاشة والنقليات' }, { id: 'd', textAr: 'الخدمات الصحية' }], correctAnswer: 'b', marks: 1 },
            { id: 44, type: 'mcq', questionAr: 'أول وزارة شُكّلت في عهد إمارة شرق الأردن عام 1921 حملت اسم:', options: [{ id: 'a', textAr: 'مجلس الإمارة' }, { id: 'b', textAr: 'مجلس الشورى' }, { id: 'c', textAr: 'مجلس الأمة' }, { id: 'd', textAr: 'مجلس المشاورين' }], correctAnswer: 'd', marks: 1 },
            { id: 45, type: 'mcq', questionAr: 'تعتبر الوحدات المدرعة سلاح الهجوم الرئيس في الجيوش الحديثة وتعرف بـ:', options: [{ id: 'a', textAr: 'السلاح الحاسم في المعركة' }, { id: 'b', textAr: 'سلاح المفاجأة' }, { id: 'c', textAr: 'سلاح الإسناد' }, { id: 'd', textAr: 'إحراز التفوق في المعركة' }], correctAnswer: 'a', marks: 1 },
            { id: 46, type: 'mcq', questionAr: 'نجمتان سباعيتان يعلوهما التاج الهاشمي وباقتان حمراوان هي رتبة:', options: [{ id: 'a', textAr: 'مقدم' }, { id: 'b', textAr: 'عميد' }, { id: 'c', textAr: 'عقيد' }, { id: 'd', textAr: 'رائد' }], correctAnswer: 'b', marks: 1 },
            { id: 47, type: 'mcq', questionAr: 'خاض الجيش العربي الأردني عدة معارك مع القوات اليهودية منها:', options: [{ id: 'a', textAr: 'معركة القدس' }, { id: 'b', textAr: 'معركة نهاوند' }, { id: 'c', textAr: 'معركة حطين' }, { id: 'd', textAr: 'معركة اليرموك' }], correctAnswer: 'a', marks: 1 },
            { id: 48, type: 'mcq', questionAr: 'القدرة العلمية والاقتصادية وعدد السكان من العوامل المؤثرة على:', options: [{ id: 'a', textAr: 'نسبة نجاح أو فشل المعركة' }, { id: 'b', textAr: 'متطلبات العمل اليومية' }, { id: 'c', textAr: 'تنظيم القوات المسلحة' }, { id: 'd', textAr: 'رفد القوات المسلحة بالعدة والعتاد' }], correctAnswer: 'd', marks: 1 },
            { id: 49, type: 'mcq', questionAr: 'من أهم أدوار سلاح الجو الملكي في تنمية المجتمع المحلي:', options: [{ id: 'a', textAr: 'الاتصال مع المؤسسات التعليمية' }, { id: 'b', textAr: 'السيطرة على المرور الجوي خارج المملكة' }, { id: 'c', textAr: 'تأمين الاتصالات السلكية واللاسلكية للمناطق النائية' }, { id: 'd', textAr: 'النقل الجوي الداخلي والخارجي' }], correctAnswer: 'd', marks: 1 },
            { id: 50, type: 'mcq', questionAr: 'السلاح الذي يعمل على المحافظة على أمن وسلامة الاتصالات هو:', options: [{ id: 'a', textAr: 'سلاح اللاسلكي الملكي' }, { id: 'b', textAr: 'سلاح الجو الملكي' }, { id: 'c', textAr: 'سلاح الصيانة الملكي' }, { id: 'd', textAr: 'سلاح الهندسة الملكي' }], correctAnswer: 'a', marks: 1 },
            { id: 51, type: 'mcq', questionAr: 'من واجبات سلاح الصيانة الملكي:', options: [{ id: 'a', textAr: 'تقديم المشورة الفنية لجميع وحدات القوات المسلحة' }, { id: 'b', textAr: 'زراعة حقول الألغام' }, { id: 'c', textAr: 'إدامة الاتصالات' }, { id: 'd', textAr: 'التخطيط لكافة الوحدات' }], correctAnswer: 'a', marks: 1 },
            { id: 52, type: 'mcq', questionAr: 'من الأهداف المرتبطة بعمليات التسلل:', options: [{ id: 'a', textAr: 'إنشاء الجسور' }, { id: 'b', textAr: 'مراقبة الخطوط الخلوية' }, { id: 'c', textAr: 'التهريب والتجسس والبحث عن العمل' }, { id: 'd', textAr: 'نشر الطمأنينة' }], correctAnswer: 'c', marks: 1 },
            { id: 53, type: 'mcq', questionAr: 'تأسست قيادة القوة البحرية سنة 1951 في مدينة العقبة وأطلق عليها اسم:', options: [{ id: 'a', textAr: 'قيادة الهندسة الملكية' }, { id: 'b', textAr: 'أسطول الجيش العربي' }, { id: 'c', textAr: 'قاعدة الأمير هاشم بن عبدالله البحرية' }, { id: 'd', textAr: 'السفن البحرية' }], correctAnswer: 'b', marks: 1 },
            { id: 54, type: 'mcq', questionAr: 'الإخلاء الجوي للحالات الصعبة من أدوار:', options: [{ id: 'a', textAr: 'سلاح الدروع' }, { id: 'b', textAr: 'سلاح المشاة' }, { id: 'c', textAr: 'سلاح الجو الملكي' }, { id: 'd', textAr: 'سلاح الهندسة' }], correctAnswer: 'c', marks: 1 },
            { id: 55, type: 'mcq', questionAr: 'من واجبات المخابرات العامة في مقاومة التخريب الفكري:', options: [{ id: 'a', textAr: 'القتل والاغتيال' }, { id: 'b', textAr: 'مكافحة التسلل' }, { id: 'c', textAr: 'عمليات التفجير' }, { id: 'd', textAr: 'مقاومة إثارة الفتن والصراعات' }], correctAnswer: 'd', marks: 1 },
            { id: 56, type: 'mcq', questionAr: 'القانون الساري على كافة موظفي وأعضاء دائرة المخابرات العامة هو:', options: [{ id: 'a', textAr: 'القانون الجزائي' }, { id: 'b', textAr: 'قانون العقوبات العسكري' }, { id: 'c', textAr: 'القانون القضائي' }, { id: 'd', textAr: 'القانون المدني' }], correctAnswer: 'b', marks: 1 },
            { id: 57, type: 'mcq', questionAr: 'يرمز لون طائر العقاب في شعار المملكة إلى:', options: [{ id: 'a', textAr: 'العزة والقوة والشجاعة' }, { id: 'b', textAr: 'راية الثورة العربية الكبرى' }, { id: 'c', textAr: 'شموخ شعار المملكة' }, { id: 'd', textAr: 'راية الرسول ﷺ' }], correctAnswer: 'd', marks: 1 },
            { id: 58, type: 'mcq', questionAr: 'من واجبات دائرة المخابرات العامة على المستوى القومي:', options: [{ id: 'a', textAr: 'حماية الأمن القومي العربي' }, { id: 'b', textAr: 'وزارة الخارجية' }, { id: 'c', textAr: 'تحدي الفقر' }, { id: 'd', textAr: 'خفض القيمة النقدية' }], correctAnswer: 'a', marks: 1 },
            { id: 59, type: 'mcq', questionAr: 'عند التخطيط لوحدات حرس الحدود يراعى التهديد من خلال:', options: [{ id: 'a', textAr: 'صيانة الأرض' }, { id: 'b', textAr: 'رفض قياس التهديد' }, { id: 'c', textAr: 'اللجوء الاقتصادي' }, { id: 'd', textAr: 'فهم وتقدير طبيعة وحجم التهديد' }], correctAnswer: 'd', marks: 1 },
            { id: 60, type: 'mcq', questionAr: 'تم تعريب قيادة الجيش العربي في عهد جلالة الملك الحسين بن طلال عام:', options: [{ id: 'a', textAr: '1 آذار 1956' }, { id: 'b', textAr: '2 أيار 1954' }, { id: 'c', textAr: '31 آذار 1956' }, { id: 'd', textAr: '25 أيار 1957' }], correctAnswer: 'a', marks: 1 }
        ]
    },
    military_science_mid_p4: {
        id: 'military_science_mid_p4',
        title: 'Mid Exam - Part 4',
        titleAr: 'مادة الميد - الجزء الرابع',
        icon: '🎖️',
        color: '#5D4037',
        questions: [
            { id: 61, type: 'mcq', questionAr: 'إعادة وحدة العرب الروحية وإحياء التاريخ القومي العربي تُعد من:', options: [{ id: 'a', textAr: 'نتائج الثورة العربية الكبرى' }, { id: 'b', textAr: 'الصعوبات التي واجهت الثورة' }, { id: 'c', textAr: 'مرتكزات الثورة' }, { id: 'd', textAr: 'أسباب الثورة' }], correctAnswer: 'a', marks: 1 },
            { id: 62, type: 'mcq', questionAr: 'إعطاء العمق للقتال (قصف أهداف بعمق العدو) من أدوار سلاح:', options: [{ id: 'a', textAr: 'المدفعية' }, { id: 'b', textAr: 'اللاسلكي' }, { id: 'c', textAr: 'الهندسة' }, { id: 'd', textAr: 'الصيانة' }], correctAnswer: 'a', marks: 1 },
            { id: 63, type: 'mcq', questionAr: 'من أكثر الصنوف سرعة في التطور والتحديث:', options: [{ id: 'a', textAr: 'الوحدات المدرعة' }, { id: 'b', textAr: 'العمليات التعبوية' }, { id: 'c', textAr: 'وحدات الخدمات' }, { id: 'd', textAr: 'قوات الصاعقة' }], correctAnswer: 'a', marks: 1 },
            { id: 64, type: 'mcq', questionAr: 'من مصادر التجنيد في القوات المسلحة الأردنية:', options: [{ id: 'a', textAr: 'طلاب معاهد التدريب المهني' }, { id: 'b', textAr: 'خريجو كليات المجتمع فقط' }, { id: 'c', textAr: 'الضباط والرتب الأخرى' }, { id: 'd', textAr: 'خريجو الجامعات الخاصة' }], correctAnswer: 'c', marks: 1 },
            { id: 65, type: 'mcq', questionAr: 'من أهداف إسرائيل في معركة الكرامة:', options: [{ id: 'a', textAr: 'كسب تعاطف الدول الكبرى' }, { id: 'b', textAr: 'تحطيم الروح المعنوية للطيارين المصريين' }, { id: 'c', textAr: 'الاستحواذ على مناطق الأغوار' }, { id: 'd', textAr: 'تخريب مدارج الطائرات' }], correctAnswer: 'c', marks: 1 },
            { id: 66, type: 'mcq', questionAr: 'فقدان الروح المعنوية بعد سقوط سلاح الجو المصري كان سببًا لهزيمة العرب في حرب:', options: [{ id: 'a', textAr: '1967' }, { id: 'b', textAr: 'معركة الكرامة' }, { id: 'c', textAr: 'حرب 1948' }, { id: 'd', textAr: 'حرب 1973' }], correctAnswer: 'a', marks: 1 },
            { id: 67, type: 'mcq', questionAr: 'كانت مهمة الجيش العربي الأردني في حرب 1948:', options: [{ id: 'a', textAr: 'التقدم شمال الحولة واحتلال صفد' }, { id: 'b', textAr: 'التقدم وسط بيسان والعفولة' }, { id: 'c', textAr: 'احتلال شمال فلسطين من حيفا حتى الناصرة' }, { id: 'd', textAr: 'التقدم باتجاه القدس والسهل الساحلي' }], correctAnswer: 'd', marks: 1 },
            { id: 68, type: 'mcq', questionAr: 'حرمان العدو من الالتفاف حول الجناح الأيسر للقوات السورية كان من أهمية مشاركة القوات الأردنية في:', options: [{ id: 'a', textAr: 'حرب 1973' }, { id: 'b', textAr: 'حرب 1948' }, { id: 'c', textAr: 'حرب 1967' }, { id: 'd', textAr: 'معركة الكرامة' }], correctAnswer: 'a', marks: 1 },
            { id: 69, type: 'mcq', questionAr: 'من نتائج الثورة العربية الكبرى:', options: [{ id: 'a', textAr: 'بناء قوات مسلحة نظامية حديثة' }, { id: 'b', textAr: 'إعلان الجهاد المقدس' }, { id: 'c', textAr: 'قيام أول دولة عربية في سوريا' }, { id: 'd', textAr: 'تفوق الجيش الإسرائيلي' }], correctAnswer: 'a', marks: 1 },
            { id: 70, type: 'mcq', questionAr: 'الواجب الرئيسي للقوة البحرية الملكية:', options: [{ id: 'a', textAr: 'مراقبة الطرق الخارجية' }, { id: 'b', textAr: 'احتلال وتعزيز الأرض' }, { id: 'c', textAr: 'تدمير تشكيلات العدو المدرعة' }, { id: 'd', textAr: 'الدفاع عن المياه الإقليمية للمملكة' }], correctAnswer: 'd', marks: 1 },
            { id: 71, type: 'mcq', questionAr: 'يمتلك سلاح الجو الملكي الأردني حاليًا:', options: [{ id: 'a', textAr: 'أحدث معدات النقل' }, { id: 'b', textAr: 'أحدث أجهزة التصاريح' }, { id: 'c', textAr: 'أحدث الطائرات التدريبية والعملياتية' }, { id: 'd', textAr: 'أحدث الوحدات الميدانية' }], correctAnswer: 'c', marks: 1 },
            { id: 72, type: 'mcq', questionAr: 'من واجبات سلاح التموين والنقل الملكي:', options: [{ id: 'a', textAr: 'تنفيذ سياسة القيادة العامة لإدامة القوات المسلحة' }, { id: 'b', textAr: 'زراعة الأراضي حول المناطق العسكرية' }, { id: 'c', textAr: 'تدريب القطاع العام على التزويد' }, { id: 'd', textAr: 'السيطرة على نقليات النقل الخاص' }], correctAnswer: 'a', marks: 1 },
            { id: 73, type: 'mcq', questionAr: 'مشاريع الحصاد المائي تتمثل في:', options: [{ id: 'a', textAr: 'إدارة الأزمات' }, { id: 'b', textAr: 'التنقيب عن الثروات' }, { id: 'c', textAr: 'الجهد الوطني للأزمات' }, { id: 'd', textAr: 'إنشاء السدود والحفائر والبرك وحفر الآبار' }], correctAnswer: 'd', marks: 1 },
            { id: 74, type: 'mcq', questionAr: 'من واجبات حرس الحدود المرتبطة بالتخطيط:', options: [{ id: 'a', textAr: 'صيانة الأرض' }, { id: 'b', textAr: 'رؤية قياس مستوى التهديد' }, { id: 'c', textAr: 'اللجوء الاقتصادي' }, { id: 'd', textAr: 'فهم وتقدير طبيعة وحجم التهديد' }], correctAnswer: 'd', marks: 1 },
            { id: 75, type: 'mcq', questionAr: 'تم تعريب قيادة الجيش العربي في عام:', options: [{ id: 'a', textAr: '1 آذار 1956' }, { id: 'b', textAr: '2 أيار 1954' }, { id: 'c', textAr: '31 آذار 1956' }, { id: 'd', textAr: '25 أيار 1957' }], correctAnswer: 'a', marks: 1 },
            { id: 76, type: 'mcq', questionAr: 'إعادة وحدة العرب الروحية وإحياء التاريخ القومي العربي والاعتراف بدولة عربية مستقلة من:', options: [{ id: 'a', textAr: 'نتائج الثورة العربية الكبرى' }, { id: 'b', textAr: 'الصعوبات' }, { id: 'c', textAr: 'المرتكزات' }, { id: 'd', textAr: 'الأسباب' }], correctAnswer: 'a', marks: 1 },
            { id: 77, type: 'mcq', questionAr: 'ضمت ولاية الديكابولس في العهد الروماني مناطق:', options: [{ id: 'a', textAr: 'بيريا والأنباط' }, { id: 'b', textAr: 'عجلون وشرق البلقاء وفيلادلفيا' }, { id: 'c', textAr: 'فيلادلفيا وجدارا' }, { id: 'd', textAr: 'فيلادلفيا وبيلا' }], correctAnswer: 'd', marks: 1 },
            { id: 78, type: 'mcq', questionAr: 'أعلن الشريف الحسين بن علي الثورة العربية الكبرى في:', options: [{ id: 'a', textAr: '10 حزيران 1916' }, { id: 'b', textAr: '10 تموز 1917' }, { id: 'c', textAr: '5 أيلول 1916' }, { id: 'd', textAr: '10 آذار 1921' }], correctAnswer: 'a', marks: 1 },
            { id: 79, type: 'mcq', questionAr: 'أول وزارة تشكلت في إمارة شرق الأردن عام 1921 حملت اسم:', options: [{ id: 'a', textAr: 'المجلس التشريعي' }, { id: 'b', textAr: 'رئاسة الأركان' }, { id: 'c', textAr: 'مجلس المشاورين' }, { id: 'd', textAr: 'مجلس الأمة' }], correctAnswer: 'c', marks: 1 },
            { id: 80, type: 'mcq', questionAr: 'طرد القوات التركية من الأراضي العربية هدف من أهداف الثورة العربية:', options: [{ id: 'a', textAr: 'السياسية' }, { id: 'b', textAr: 'العسكرية' }, { id: 'c', textAr: 'النفسية والمعنوية' }, { id: 'd', textAr: 'الاقتصادية' }], correctAnswer: 'b', marks: 1 }
        ]
    },
    military_science_mid_p5: {
        id: 'military_science_mid_p5',
        title: 'Mid Exam - Part 5',
        titleAr: 'مادة الميد - الجزء الخامس',
        icon: '🎖️',
        color: '#5D4037',
        questions: [
            { id: 81, type: 'mcq', questionAr: 'الدور الرئيسي لسلاح المدفعية الملكي:', options: [{ id: 'a', textAr: 'الإسناد الهندسي' }, { id: 'b', textAr: 'مساعدة المدنيين' }, { id: 'c', textAr: 'تقديم نيران الإسناد للوحدات المقاتلة' }, { id: 'd', textAr: 'التفتيش البحري' }], correctAnswer: 'c', marks: 1 },
            { id: 82, type: 'mcq', questionAr: 'مجموعة ضباط مؤهلين عسكريًا وفنيًا لنصح القائد تُسمى:', options: [{ id: 'a', textAr: 'وكيل القوة' }, { id: 'b', textAr: 'هيئة الركن' }, { id: 'c', textAr: 'قائد الفصيل' }, { id: 'd', textAr: 'ليس مما ذكر' }], correctAnswer: 'b', marks: 1 },
            { id: 83, type: 'mcq', questionAr: 'استشهد الملك عبدالله الأول بن الحسين عام:', options: [{ id: 'a', textAr: '1951' }, { id: 'b', textAr: '1952' }, { id: 'c', textAr: '1948' }, { id: 'd', textAr: '1968' }], correctAnswer: 'a', marks: 1 },
            { id: 84, type: 'mcq', questionAr: 'ثلاثة شرائط على الذراع هي رتبة:', options: [{ id: 'a', textAr: 'رقيب' }, { id: 'b', textAr: 'وكيل' }, { id: 'c', textAr: 'نقيب' }, { id: 'd', textAr: 'عريف' }], correctAnswer: 'a', marks: 1 },
            { id: 85, type: 'mcq', questionAr: 'شفرتان نحاسيتان على الكتف هي رتبة:', options: [{ id: 'a', textAr: 'رقيب' }, { id: 'b', textAr: 'وكيل أول' }, { id: 'c', textAr: 'وكيل' }, { id: 'd', textAr: 'جندي' }], correctAnswer: 'c', marks: 1 },
            { id: 86, type: 'mcq', questionAr: 'اللون الذي اتخذه العباسيون لرايتهم هو:', options: [{ id: 'a', textAr: 'الأسود' }, { id: 'b', textAr: 'الأبيض' }, { id: 'c', textAr: 'الأحمر' }, { id: 'd', textAr: 'الأخضر' }], correctAnswer: 'a', marks: 1 },
            { id: 87, type: 'mcq', questionAr: 'دخلت شرق الأردن تحت الحكم الإسلامي عام 630م بعد:', options: [{ id: 'a', textAr: 'معركة اليرموك' }, { id: 'b', textAr: 'غزوة تبوك' }, { id: 'c', textAr: 'غزوة مؤتة' }, { id: 'd', textAr: 'معركة فحل' }], correctAnswer: 'b', marks: 1 },
            { id: 88, type: 'mcq', questionAr: 'نشبت حرب الخليج الثانية في عهد الملك:', options: [{ id: 'a', textAr: 'عبدالله الثاني' }, { id: 'b', textAr: 'عبدالله الأول' }, { id: 'c', textAr: 'الحسين بن طلال' }, { id: 'd', textAr: 'طلال بن عبدالله' }], correctAnswer: 'c', marks: 1 },
            { id: 89, type: 'mcq', questionAr: 'سُمي الجيش العربي عام 1923 بـ:', options: [{ id: 'a', textAr: 'قوة البادية' }, { id: 'b', textAr: 'القوة السيارة' }, { id: 'c', textAr: 'القوة الآلية' }, { id: 'd', textAr: 'الحرس الوطني' }], correctAnswer: 'b', marks: 1 },
            { id: 90, type: 'mcq', questionAr: 'تستمد الراية الهاشمية لونها الأحمر الداكن من راية:', options: [{ id: 'a', textAr: 'الشريف أبي نمي' }, { id: 'b', textAr: 'العباسيين' }, { id: 'c', textAr: 'الفاطميين' }, { id: 'd', textAr: 'الأمويين' }], correctAnswer: 'a', marks: 1 }
        ]
    },
    military_science_final: {
        id: 'military_science_final',
        title: 'Final Exam',
        titleAr: 'امتحان نهاية الفصل',
        icon: '🎖️',
        color: '#5D4037',
        questions: []
    },

    islam_and_life_p1: {
        id: 'islam_and_life_p1',
        title: 'Islam and Life - Part 1',
        titleAr: 'إسلام وحياة - الجزء الأول',
        icon: '🕌',
        color: '#4CAF50',
        questions: [
            { id: 1, type: 'mcq', questionAr: 'التزام الأخلاق الحميدة يزيد في إيمان العبد كما أن سوء الخلق ينقص من الإيمان، ويدل على هذا المعنى النص الشرعي الآتي:', options: [{ id: 'a', textAr: 'حديث: أكمل المؤمنين إيمانًا أحسنهم خلقًا' }, { id: 'b', textAr: 'حديث: الإيمان بضع وسبعون شعبة' }, { id: 'c', textAr: 'حديث: لا يزني الزاني حين يزني وهو مؤمن' }, { id: 'd', textAr: 'حديث: إنما بعثت لأتمم مكارم الأخلاق' }], correctAnswer: 'a', marks: 1 },
            { id: 2, type: 'mcq', questionAr: 'الأخلاق الطيبة أساس لتكوين الشخصية الفردية، هذه العبارة تعبّر عن أثر من آثار الأخلاق على:', options: [{ id: 'a', textAr: 'العبادة' }, { id: 'b', textAr: 'المؤسسات التعليمية' }, { id: 'c', textAr: 'النفس الإنسانية' }, { id: 'd', textAr: 'المجتمع' }], correctAnswer: 'c', marks: 1 },
            { id: 3, type: 'mcq', questionAr: 'الخُلُق بضم اللام يختص في معناه اللغوي بـ:', options: [{ id: 'a', textAr: 'الهيئات' }, { id: 'b', textAr: 'الصور المدركة بالبصر' }, { id: 'c', textAr: 'الأشكال' }, { id: 'd', textAr: 'السجية' }], correctAnswer: 'd', marks: 1 },
            { id: 4, type: 'mcq', questionAr: 'النص الشرعي الذي يدل على أن مفهوم العبادة يتسع ليشمل كثيرًا من الممارسات الأخلاقية الحسية هو:', options: [{ id: 'a', textAr: 'قوله تعالى: إن الصلاة تنهى عن الفحشاء والمنكر' }, { id: 'b', textAr: 'حديث: أتدرون ما المفلس؟' }, { id: 'c', textAr: 'حديث: كل سلامى من الناس عليه صدقة كل يوم تطلع فيه الشمس' }, { id: 'd', textAr: 'حديث: من لم يدع قول الزور والعمل به فلا حاجة أن يدع طعامه وشرابه' }], correctAnswer: 'c', marks: 1 },
            { id: 5, type: 'mcq', questionAr: 'خُلُق يعف به الإنسان عمّا ليس له به حق وإن تهيأت له ظروف العدوان عليه دون أن تلحقه إدانة، المقصود هو خُلُق:', options: [{ id: 'a', textAr: 'الأمانة' }, { id: 'b', textAr: 'التواضع' }, { id: 'c', textAr: 'الإيثار' }, { id: 'd', textAr: 'الكرم' }], correctAnswer: 'a', marks: 1 },
            { id: 6, type: 'mcq', questionAr: 'إن العناية بحفظ الضرورات في الإسلام يعتبر:', options: [{ id: 'a', textAr: 'دينًا وعبادة ووصية من الله يثاب عليها ويعاقب على التفريط بها' }, { id: 'b', textAr: 'مجرد تشريع قانوني' }, { id: 'c', textAr: 'أمرًا مستحبًا لا واجبًا' }, { id: 'd', textAr: 'أمرًا يفرضه واقع الوجود الإنساني' }], correctAnswer: 'a', marks: 1 },
            { id: 7, type: 'mcq', questionAr: 'جاء في الحديث: لا يحل دم امرئ مسلم يشهد أن لا إله إلا الله وأني رسول الله إلا بإحدى ثلاث:', options: [{ id: 'a', textAr: 'الثيب الزاني والنفس بالنفس والتجسس' }, { id: 'b', textAr: 'الثيب الزاني والسحر والتارك لدينه' }, { id: 'c', textAr: 'الثيب الزاني والنفس بالنفس والتارك لدينه المفارق للجماعة' }, { id: 'd', textAr: 'الثيب الزاني والنفس بالنفس والسحر' }], correctAnswer: 'c', marks: 1 },
            { id: 8, type: 'mcq', questionAr: 'جاء في الحديث: أول ما يقضى به بين الناس:', options: [{ id: 'a', textAr: 'الصلاة' }, { id: 'b', textAr: 'الأموال' }, { id: 'c', textAr: 'الأعراض' }, { id: 'd', textAr: 'الدماء' }], correctAnswer: 'd', marks: 1 },
            { id: 9, type: 'mcq', questionAr: 'شرع الله ما يحفظ الدين بالحد الأعلى والأكمل ومن ذلك أن يقوم الفرد بـ:', options: [{ id: 'a', textAr: 'أداء الصلوات المكتوبة' }, { id: 'b', textAr: 'إيتاء الزكاة' }, { id: 'c', textAr: 'صيام رمضان' }, { id: 'd', textAr: 'أداء السنن الرواتب في الصلاة' }], correctAnswer: 'd', marks: 1 },
            { id: 10, type: 'mcq', questionAr: 'واحدة فقط من الضرورات لم تراعها كل الشرائع والملل والقوانين البشرية، وهي حفظ:', options: [{ id: 'a', textAr: 'العقل' }, { id: 'b', textAr: 'العرض' }, { id: 'c', textAr: 'النفس' }, { id: 'd', textAr: 'الدين' }], correctAnswer: 'd', marks: 1 },
            { id: 11, type: 'mcq', questionAr: 'في قوله تعالى: ﴿ولا تقربوا الزنا﴾ حفظ لـ:', options: [{ id: 'a', textAr: 'النسل' }, { id: 'b', textAr: 'النسب' }, { id: 'c', textAr: 'العرض' }, { id: 'd', textAr: 'جميع الإجابات صحيحة' }], correctAnswer: 'd', marks: 1 }
        ]
    },
    islam_and_life_p2: {
        id: 'islam_and_life_p2',
        title: 'Islam and Life - Part 2',
        titleAr: 'إسلام وحياة - الجزء الثاني',
        icon: '🕌',
        color: '#4CAF50',
        questions: [
            { id: 12, type: 'mcq', questionAr: 'زنت امرأة مجنونة محصنة على عهد عمر فأراد أن يقيم عليها حد الرجم فمنعه الصحابي:', options: [{ id: 'a', textAr: 'عثمان بن عفان' }, { id: 'b', textAr: 'عبد الله بن عباس' }, { id: 'c', textAr: 'عبد الله بن مسعود' }, { id: 'd', textAr: 'علي بن أبي طالب' }], correctAnswer: 'd', marks: 1 },
            { id: 13, type: 'mcq', questionAr: 'قال تعالى: ﴿قل هذه سبيلي أدعو إلى الله على بصيرة أنا ومن اتبعني﴾، السبيل المقصودة هي:', options: [{ id: 'a', textAr: 'أدعو إلى الله' }, { id: 'b', textAr: 'أؤمن بالله' }, { id: 'c', textAr: 'أعمل لله' }, { id: 'd', textAr: 'أجاهد لله' }], correctAnswer: 'a', marks: 1 },
            { id: 14, type: 'mcq', questionAr: 'لمن لم يحكم بما أنزل الله أثبت الله في القرآن صفة:', options: [{ id: 'a', textAr: 'الكفر' }, { id: 'b', textAr: 'الظلم' }, { id: 'c', textAr: 'الفسق' }, { id: 'd', textAr: 'جميع الإجابات صحيحة' }], correctAnswer: 'd', marks: 1 },
            { id: 15, type: 'mcq', questionAr: 'جاء في الحديث: من حمل علينا السلاح:', options: [{ id: 'a', textAr: 'كافر' }, { id: 'b', textAr: 'فليس منا' }, { id: 'c', textAr: 'ملعون' }, { id: 'd', textAr: 'قتلناه' }], correctAnswer: 'b', marks: 1 },
            { id: 16, type: 'mcq', questionAr: 'من بلغ حد الاضطرار جوعًا يجوز له أن:', options: [{ id: 'a', textAr: 'يتزود من الميتة أو الطعام المحرم حتى يجد حلالًا' }, { id: 'b', textAr: 'يأكل الميتة فقط' }, { id: 'c', textAr: 'جميع الإجابات صحيحة' }, { id: 'd', textAr: 'يأكل من مال الغير ولو جبرًا' }], correctAnswer: 'a', marks: 1 },
            { id: 17, type: 'mcq', questionAr: 'بينت السنة فيما يتعلق بالضرورات أن:', options: [{ id: 'a', textAr: 'من قُتل دونها فهو شهيد' }, { id: 'b', textAr: 'الاعتداء عليها من أعظم الذنوب' }, { id: 'c', textAr: 'الاعتداء على واحدة منها من المهلكات' }, { id: 'd', textAr: 'جميع الإجابات صحيحة' }], correctAnswer: 'd', marks: 1 },
            { id: 18, type: 'mcq', questionAr: 'أنزل الله القرآن أساسًا من أجل:', options: [{ id: 'a', textAr: 'فهمه وتدبره' }, { id: 'b', textAr: 'العمل بما فيه من أمر ونهي' }, { id: 'c', textAr: 'تلاوته بأحكام التجويد' }, { id: 'd', textAr: 'حفظه وعدم نسيانه' }], correctAnswer: 'b', marks: 1 },
            { id: 19, type: 'mcq', questionAr: 'يقتل الزاني المحصن رجمًا بإقامة البينة وهي شهادة:', options: [{ id: 'a', textAr: 'أربعة من الرجال العدول' }, { id: 'b', textAr: 'رجلين وامرأتين' }, { id: 'c', textAr: 'ثلاثة رجال عدول' }, { id: 'd', textAr: 'رجلين عدول' }], correctAnswer: 'a', marks: 1 },
            { id: 20, type: 'mcq', questionAr: 'إقامة الحدود والقصاص من اختصاص:', options: [{ id: 'a', textAr: 'أصحاب النفوذ' }, { id: 'b', textAr: 'أهل الحل والعقد' }, { id: 'c', textAr: 'المجني عليه' }, { id: 'd', textAr: 'الإمام أو نائبه فقط' }], correctAnswer: 'd', marks: 1 },
            { id: 21, type: 'mcq', questionAr: 'لا يكون الدين محفوظًا حقًا إلا أن يكون:', options: [{ id: 'a', textAr: 'يعتنقه عدد كبير' }, { id: 'b', textAr: 'عامرة به المساجد' }, { id: 'c', textAr: 'في قلوب العلماء' }, { id: 'd', textAr: 'حاكمًا للحياة يحفظ الحقوق ويرد الباطل' }], correctAnswer: 'd', marks: 1 },
            { id: 22, type: 'mcq', questionAr: 'يجوز لمن كان معرضًا للهلاك من الجوع أن:', options: [{ id: 'a', textAr: 'يأكل الطعام المحرم عند الضرورة' }, { id: 'b', textAr: 'يأكل المحرم إن لم يجد غيره' }, { id: 'c', textAr: 'جميع الإجابات صحيحة' }, { id: 'd', textAr: 'يأكل من مال الغير عند الحاجة' }], correctAnswer: 'c', marks: 1 }
        ]
    },
    calculus_quiz1: {
        id: 'calculus_quiz1',
        title: 'Quiz 1 - Functions',
        titleAr: 'الكويز الأول - الاقترانات',
        icon: '📐',
        color: '#FF9800',
        questions: []
    },
    calculus_quiz2: {
        id: 'calculus_quiz2',
        title: 'Quiz 2',
        titleAr: 'الكويز الثاني',
        icon: '📐',
        color: '#FF9800',
        questions: []
    },
    info_security: {
        id: 'info_security',
        title: 'Information Security Principles',
        titleAr: 'مبادئ أمن المعلومات',
        icon: '🔒',
        color: '#F44336',
        questions: []
    },
    entrepreneurship_quiz1: {
        id: 'entrepreneurship_quiz1',
        title: 'Quiz 1',
        titleAr: 'الكويز الأول',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'What is "Mass Customization" (MC) described as?',
                options: [
                    { id: 'a', textEn: 'Offering only one standard product for all customers' },
                    { id: 'b', textEn: 'Providing packages of non-price factors tailored to different market segments' },
                    { id: 'c', textEn: 'Eliminating all personalization from the market' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Which source of innovation is linked to our desire for "personalization"?',
                options: [
                    { id: 'a', textEn: 'Completely ignoring customer preferences' },
                    { id: 'b', textEn: 'The demand for variety and personalized goods' },
                    { id: 'c', textEn: 'Mass production without variation' },
                    { id: 'd', textEn: 'Uniform products for every market' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Which saying captures the idea of "need pull" innovation?',
                options: [
                    { id: 'a', textEn: 'Accidents lead to breakthroughs' },
                    { id: 'b', textEn: 'Necessity is the Mother of invention' },
                    { id: 'c', textEn: 'Technology drives markets' },
                    { id: 'd', textEn: 'Innovation springs from imagination' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'In major humanitarian crises, which areas force a rapid pace of innovation?',
                options: [
                    { id: 'a', textEn: 'Logistics, shelter, healthcare, water, and energy' },
                    { id: 'b', textEn: 'Luxury travel and dining' },
                    { id: 'c', textEn: 'Fashion and entertainment' },
                    { id: 'd', textEn: 'Sports equipment design' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'What does "knowledge push" refer to in the context of innovation?',
                options: [
                    { id: 'a', textEn: 'Identifying unmet consumer needs' },
                    { id: 'b', textEn: 'Providing childcare services' },
                    { id: 'c', textEn: 'Large spending on research and development (R&D)' },
                    { id: 'd', textEn: 'Reducing waste in production processes' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'One of the following is an example of social innovation that has emerged from meeting needs:',
                options: [
                    { id: 'a', textEn: 'Preschools that provide childcare for working parents' },
                    { id: 'b', textEn: 'Online banking platforms' },
                    { id: 'c', textEn: 'Electric cars for urban residents' },
                    { id: 'd', textEn: 'Smartphones with high-resolution cameras' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Urgency of a need can have a forcing effect on innovation, what major effect has the energy crisis had?',
                options: [
                    { id: 'a', textEn: 'It limited innovation to healthcare only' },
                    { id: 'b', textEn: 'It created a significant pull for innovation around alternative energy' },
                    { id: 'c', textEn: 'It stopped all innovation activities worldwide' },
                    { id: 'd', textEn: 'It reduced interest in alternative energy sources' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'What does "crisis-driven innovation" refer to?',
                options: [
                    { id: 'a', textEn: 'Innovation that avoids any changes in processes' },
                    { id: 'b', textEn: 'Innovation limited to product design only' },
                    { id: 'c', textEn: 'Innovation that occurs only during peacetime' },
                    { id: 'd', textEn: 'Innovation forced by urgent needs during crises' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which of the following is NOT listed as a source of innovation in the text?',
                options: [
                    { id: 'a', textEn: 'Celebrity endorsements' },
                    { id: 'b', textEn: 'Users as Innovators' },
                    { id: 'c', textEn: 'Futures and Forecasting' },
                    { id: 'd', textEn: 'Accidents' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: '"Base of the Pyramid" markets are characterized by:',
                options: [
                    { id: 'a', textEn: 'Small, aging populations' },
                    { id: 'b', textEn: 'Primarily industrial economies' },
                    { id: 'c', textEn: 'Large, young populations with limited income' },
                    { id: 'd', textEn: 'High disposable income' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            }
        ]
    },
    entrepreneurship_quiz2: {
        id: 'entrepreneurship_quiz2',
        title: 'Quiz 2',
        titleAr: 'الكويز الثاني',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Which of the following is NOT listed among the success factors for new product development?',
                options: [
                    { id: 'a', textEn: 'Clear product definition' },
                    { id: 'b', textEn: 'Project organization' },
                    { id: 'c', textEn: 'Risk assessment' },
                    { id: 'd', textEn: 'Customer contact intensity' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'During project selection, which type of criteria is identified as the most common used to screen and evaluate projects before development begins?',
                options: [
                    { id: 'a', textEn: 'Financial criteria' },
                    { id: 'b', textEn: 'Market criteria' },
                    { id: 'c', textEn: 'Ethical criteria' },
                    { id: 'd', textEn: 'Technological criteria' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'How many stages does the simplified model that may differentiate the various factors that must be managed at each stage?',
                options: [
                    { id: 'a', textEn: 'Five stages' },
                    { id: 'b', textEn: 'Six stages' },
                    { id: 'c', textEn: 'Three stages' },
                    { id: 'd', textEn: 'Four stages' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'Which Innovation characteristic (factor) influencing adoption is defined as: "the extent to which an innovation can be tested on a limited scale"?',
                options: [
                    { id: 'a', textEn: 'Observability' },
                    { id: 'b', textEn: 'Trialability' },
                    { id: 'c', textEn: 'Compatibility' },
                    { id: 'd', textEn: 'Complexity' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Which statement about the storage of services is accurate?',
                options: [
                    { id: 'a', textEn: 'Services can be stocked in warehouses for later use' },
                    { id: 'b', textEn: 'Services are stored as inventory items' },
                    { id: 'c', textEn: 'Services cannot usually be stored' },
                    { id: 'd', textEn: 'Services are usually stored as digital files' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'The term "Observability" means:',
                options: [
                    { id: 'a', textEn: 'How cheap the innovation is' },
                    { id: 'b', textEn: 'How visible to others the results are' },
                    { id: 'c', textEn: 'How visible the product is on the shelves' },
                    { id: 'd', textEn: 'How regulated the innovation is' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'In the simplified model, the stage that involves testing, launching and marketing the new product is:',
                options: [
                    { id: 'a', textEn: 'Product development' },
                    { id: 'b', textEn: 'Concept generation' },
                    { id: 'c', textEn: 'Project assessment and selection' },
                    { id: 'd', textEn: 'Product commercialization' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'To ensure the success of new products, top management support will extend:',
                options: [
                    { id: 'a', textEn: 'From concept through to launch' },
                    { id: 'b', textEn: 'From market research to product launch' },
                    { id: 'c', textEn: 'From prototype testing to commercialization' },
                    { id: 'd', textEn: 'From idea generation to post‑launch review' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which category of innovation is described as creating new services and products?',
                options: [
                    { id: 'a', textEn: 'Organizational innovations' },
                    { id: 'b', textEn: 'Technological innovations' },
                    { id: 'c', textEn: 'Process innovations' },
                    { id: 'd', textEn: 'Commercial innovations' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'The gradual process of reducing uncertainty through a series of problem-solving phases that extend from scanning and selecting into implementation is:',
                options: [
                    { id: 'a', textEn: 'New product or service development process' },
                    { id: 'b', textEn: 'Reducing uncertainty process' },
                    { id: 'c', textEn: 'Increasing marketing budget process' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            }
        ]
    },
    entrepreneurship_quiz3: {
        id: 'entrepreneurship_quiz3',
        title: 'Quiz 3',
        titleAr: 'الكويز الثالث',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'A strong value proposition mainly focuses on:',
                options: [
                    { id: 'a', textEn: 'Customer benefits and problems solved' },
                    { id: 'b', textEn: 'Production efficiency' },
                    { id: 'c', textEn: 'Legal requirements' },
                    { id: 'd', textEn: 'Employee benefits' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'A business model is best defined as:',
                options: [
                    { id: 'a', textEn: 'An explanation of how value is created for customers' },
                    { id: 'b', textEn: 'A financial report' },
                    { id: 'c', textEn: 'A production plan' },
                    { id: 'd', textEn: 'A marketing strategy' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'In the Individual decision type, the final decision is made...',
                options: [
                    { id: 'a', textEn: 'By a committee' },
                    { id: 'b', textEn: 'Independently of peers' },
                    { id: 'c', textEn: 'Through a vote' },
                    { id: 'd', textEn: 'By a leader' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'A business model explains how an idea is transformed into:',
                options: [
                    { id: 'a', textEn: 'Something valuable for customers' },
                    { id: 'b', textEn: 'A technical process' },
                    { id: 'c', textEn: 'An organizational structure' },
                    { id: 'd', textEn: 'A legal contract' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Technological innovations are the source of what improvements?',
                options: [
                    { id: 'a', textEn: 'productivity and quality improvements' },
                    { id: 'b', textEn: 'new services' },
                    { id: 'c', textEn: 'environmental sustainability' },
                    { id: 'd', textEn: 'Social and health gains' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'What factor describes how much an innovation is favored over the product it replaces?',
                options: [
                    { id: 'a', textEn: 'Relative advantage' },
                    { id: 'b', textEn: 'Compatibility' },
                    { id: 'c', textEn: 'Compatibility' },
                    { id: 'd', textEn: 'Observability' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'What does the acronym DFM stand for?',
                options: [
                    { id: 'a', textEn: 'Design for Manufacture' },
                    { id: 'b', textEn: 'Dynamic Flow Management' },
                    { id: 'c', textEn: 'Design for Marketing' },
                    { id: 'd', textEn: 'Design for Marketing' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Which model uses \'gates\' to make go/no‑go decisions?',
                options: [
                    { id: 'a', textEn: 'Porter\'s approach' },
                    { id: 'b', textEn: 'Ansoff matrix' },
                    {
                        id: 'c', textEn: 'Cooper\'s approach'
                    },
                    { id: 'd', textEn: 'SWOT analysis' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which of the following is listed as a tangible aspect affecting the perceptions of service quality?',
                options: [
                    { id: 'a', textEn: 'Appearance of facilities, equipment and staff' },
                    { id: 'b', textEn: 'Number of patents' },
                    { id: 'c', textEn: 'Speed of internet connection' },
                    { id: 'd', textEn: 'Size of warehouse' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'Generic business models are best described as:',
                options: [
                    { id: 'a', textEn: 'Limited to start-ups' },
                    { id: 'b', textEn: 'Unique to one organization' },
                    { id: 'c', textEn: 'Outdated business practices' },
                    { id: 'd', textEn: 'Common patterns used across industries' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            }
        ]
    },
    entrepreneurship_quiz4: {
        id: 'entrepreneurship_quiz4',
        title: 'Quiz 4',
        titleAr: 'الكويز الرابع',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'Innovation means:', options: [{ id: 'a', textEn: 'stopping change' }, { id: 'b', textEn: 'translating ideas into useful new products, processes, or services' }, { id: 'c', textEn: 'avoiding risk' }, { id: 'd', textEn: 'copying competitors' }], correctAnswer: 'b', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'Invention means:', options: [{ id: 'a', textEn: 'improving an existing service' }, { id: 'b', textEn: 'coming up with a new idea' }, { id: 'c', textEn: 'managing a project' }, { id: 'd', textEn: 'entering a market' }], correctAnswer: 'b', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'Incremental innovation means:', options: [{ id: 'a', textEn: 'doing something completely different' }, { id: 'b', textEn: 'small improvements to existing products, services, or processes' }, { id: 'c', textEn: 'ignoring existing markets' }, { id: 'd', textEn: 'replacing the whole system' }], correctAnswer: 'b', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'Radical innovation means:', options: [{ id: 'a', textEn: 'small change only' }, { id: 'b', textEn: 'repeating the same method' }, { id: 'c', textEn: 'significantly different changes to products, services, or processes' }, { id: 'd', textEn: 'no change at all' }], correctAnswer: 'c', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'Entrepreneurship is:', options: [{ id: 'a', textEn: 'avoiding responsibility' }, { id: 'b', textEn: 'a mixture of energy, vision, passion, commitment, judgment, and risk-taking' }, { id: 'c', textEn: 'only working in small companies' }, { id: 'd', textEn: 'only selling products' }], correctAnswer: 'b', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Product innovation refers to changes in:', options: [{ id: 'a', textEn: 'organizational culture' }, { id: 'b', textEn: 'products or services offered by the organization' }, { id: 'c', textEn: 'employee salaries' }, { id: 'd', textEn: 'customer complaints only' }], correctAnswer: 'b', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'Process innovation refers to changes in:', options: [{ id: 'a', textEn: 'the ways products or services are created and delivered' }, { id: 'b', textEn: 'the business name' }, { id: 'c', textEn: 'company ownership only' }, { id: 'd', textEn: 'market location only' }], correctAnswer: 'a', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'Position innovation refers to changes in:', options: [{ id: 'a', textEn: 'accounting methods' }, { id: 'b', textEn: 'the context in which products or services are introduced' }, { id: 'c', textEn: 'product color only' }, { id: 'd', textEn: 'staff training only' }], correctAnswer: 'b', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Paradigm innovation refers to changes in:', options: [{ id: 'a', textEn: 'office furniture' }, { id: 'b', textEn: 'the underlying mental models of the organization' }, { id: 'c', textEn: 'the product size only' }, { id: 'd', textEn: 'delivery speed only' }], correctAnswer: 'b', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'Innovation is strongly associated with:', options: [{ id: 'a', textEn: 'decline' }, { id: 'b', textEn: 'growth' }, { id: 'c', textEn: 'isolation' }, { id: 'd', textEn: 'failure only' }], correctAnswer: 'b', marks: 1.0 }
        ]
    },
    entrepreneurship_quiz5: {
        id: 'entrepreneurship_quiz5',
        title: 'Quiz 5',
        titleAr: 'الكويز الخامس',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'Innovation is also considered:', options: [{ id: 'a', textEn: 'a minor activity' }, { id: 'b', textEn: 'a survival imperative' }, { id: 'c', textEn: 'a waste of time' }, { id: 'd', textEn: 'a temporary trend' }], correctAnswer: 'b', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'Entrepreneurs are described in the slides as:', options: [{ id: 'a', textEn: 'people who avoid all risks' }, { id: 'b', textEn: 'people who calculate costs and potential gains' }, { id: 'c', textEn: 'people who reject change' }, { id: 'd', textEn: 'people who only work in government' }], correctAnswer: 'b', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'Innovation contributes to competitive success by:', options: [{ id: 'a', textEn: 'reducing all uncertainty completely' }, { id: 'b', textEn: 'being a strategic resource' }, { id: 'c', textEn: 'eliminating all competitors' }, { id: 'd', textEn: 'preventing public services' }], correctAnswer: 'b', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'Context can influence innovation through:', options: [{ id: 'a', textEn: 'resources, talent, opportunities, infrastructure, and support' }, { id: 'b', textEn: 'luck only' }, { id: 'c', textEn: 'managers only' }, { id: 'd', textEn: 'advertisements only' }], correctAnswer: 'a', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'Outcomes of innovation and entrepreneurship are profoundly affected by:', options: [{ id: 'a', textEn: 'education, training, experience, and aptitude' }, { id: 'b', textEn: 'age only' }, { id: 'c', textEn: 'office location only' }, { id: 'd', textEn: 'product packaging only' }], correctAnswer: 'a', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Innovation does not just happen; it is driven by:', options: [{ id: 'a', textEn: 'routine work' }, { id: 'b', textEn: 'entrepreneurship' }, { id: 'c', textEn: 'luck alone' }, { id: 'd', textEn: 'government rules only' }], correctAnswer: 'b', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'Innovation is the specific tool of:', options: [{ id: 'a', textEn: 'customers' }, { id: 'b', textEn: 'entrepreneurs' }, { id: 'c', textEn: 'suppliers' }, { id: 'd', textEn: 'competitors' }], correctAnswer: 'b', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'One area where innovation makes a difference is:', options: [{ id: 'a', textEn: 'identifying or creating opportunities' }, { id: 'b', textEn: 'stopping market growth' }, { id: 'c', textEn: 'reducing ideas' }, { id: 'd', textEn: 'canceling services' }], correctAnswer: 'a', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Innovation can also offer:', options: [{ id: 'a', textEn: 'new ways of serving existing markets' }, { id: 'b', textEn: 'only new factories' }, { id: 'c', textEn: 'only public ownership' }, { id: 'd', textEn: 'only internal reports' }], correctAnswer: 'a', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'Online banking and insurance services are examples of:', options: [{ id: 'a', textEn: 'meeting social needs only' }, { id: 'b', textEn: 'rethinking services' }, { id: 'c', textEn: 'product failure' }, { id: 'd', textEn: 'cost cutting only' }], correctAnswer: 'b', marks: 1.0 }
        ]
    },
    entrepreneurship_quiz6: {
        id: 'entrepreneurship_quiz6',
        title: 'Quiz 6',
        titleAr: 'الكويز السادس',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'Entrepreneurship across the lifecycle of organizations creates:', options: [{ id: 'a', textEn: 'only social value' }, { id: 'b', textEn: 'only commercial value' }, { id: 'c', textEn: 'social and commercial value' }, { id: 'd', textEn: 'no value' }], correctAnswer: 'c', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'In the start-up stage of creating commercial value, the entrepreneur is usually:', options: [{ id: 'a', textEn: 'exploiting new technology or market opportunity' }, { id: 'b', textEn: 'retiring from the market' }, { id: 'c', textEn: 'stopping innovation' }, { id: 'd', textEn: 'reducing production' }], correctAnswer: 'a', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'In the renew stage of creating commercial value, the organization returns to:', options: [{ id: 'a', textEn: 'no innovation' }, { id: 'b', textEn: 'radical innovation' }, { id: 'c', textEn: 'old markets only' }, { id: 'd', textEn: 'simple accounting' }], correctAnswer: 'b', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'Social entrepreneurship is concerned with:', options: [{ id: 'a', textEn: 'improving or changing something in the social sphere' }, { id: 'b', textEn: 'avoiding community issues' }, { id: 'c', textEn: 'focusing only on profit' }, { id: 'd', textEn: 'closing public services' }], correctAnswer: 'a', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'The slides state that most new ideas:', options: [{ id: 'a', textEn: 'always succeed' }, { id: 'b', textEn: 'fail' }, { id: 'c', textEn: 'need no effort' }, { id: 'd', textEn: 'create immediate profit' }], correctAnswer: 'b', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Many SMEs fail because they:', options: [{ id: 'a', textEn: 'innovate too quickly' }, { id: 'b', textEn: 'do not recognize the need for change' }, { id: 'c', textEn: 'have too many employees' }, { id: 'd', textEn: 'sell online' }], correctAnswer: 'b', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'NIH stands for:', options: [{ id: 'a', textEn: 'New Ideas Help' }, { id: 'b', textEn: 'Not Invented Here' }, { id: 'c', textEn: 'New Innovation Habit' }, { id: 'd', textEn: 'No Internal Help' }], correctAnswer: 'b', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'Business model innovation is seen by many managers as:', options: [{ id: 'a', textEn: 'the greatest threat to competitive position' }, { id: 'b', textEn: 'an unimportant issue' }, { id: 'c', textEn: 'a type of marketing only' }, { id: 'd', textEn: 'a financial report' }], correctAnswer: 'a', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Innovation includes:', options: [{ id: 'a', textEn: 'only radical innovation' }, { id: 'b', textEn: 'only invention' }, { id: 'c', textEn: 'both radical and incremental innovation' }, { id: 'd', textEn: 'only social entrepreneurship' }], correctAnswer: 'c', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'Successful large corporations survive because they can:', options: [{ id: 'a', textEn: 'avoid innovation' }, { id: 'b', textEn: 'innovate continuously' }, { id: 'c', textEn: 'reject all new ideas' }, { id: 'd', textEn: 'work without strategy' }], correctAnswer: 'b', marks: 1.0 }
        ]
    },
    entrepreneurship_quiz7: {
        id: 'entrepreneurship_quiz7',
        title: 'Quiz 7',
        titleAr: 'الكويز السابع',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'To manage innovation successfully, innovators should:', options: [{ id: 'a', textEn: 'ignore dimensions of innovation' }, { id: 'b', textEn: 'manage innovation as a process' }, { id: 'c', textEn: 'stop building capability' }, { id: 'd', textEn: 'avoid strategy' }], correctAnswer: 'b', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'The four dimensions of innovation include:', options: [{ id: 'a', textEn: 'product, process, position, paradigm' }, { id: 'b', textEn: 'price, promotion, place, people' }, { id: 'c', textEn: 'planning, profit, product, policy' }, { id: 'd', textEn: 'idea, risk, cost, sales' }], correctAnswer: 'a', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'Paradigm innovation is closely related to:', options: [{ id: 'a', textEn: 'business model' }, { id: 'b', textEn: 'office structure' }, { id: 'c', textEn: 'employee attendance' }, { id: 'd', textEn: 'advertising only' }], correctAnswer: 'a', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: "Ownership to rental is an example of:", options: [{ id: 'a', textEn: 'product innovation only' }, { id: 'b', textEn: 'business model innovation' }, { id: 'c', textEn: 'process failure' }, { id: 'd', textEn: 'cost reduction only' }], correctAnswer: 'b', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: "Offline to online is an example of:", options: [{ id: 'a', textEn: 'business model innovation' }, { id: 'b', textEn: 'employee training' }, { id: 'c', textEn: 'paradigm rejection' }, { id: 'd', textEn: 'inventory loss' }], correctAnswer: 'a', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Mass customization and co-creation involve:', options: [{ id: 'a', textEn: 'standardized products only' }, { id: 'b', textEn: 'user engagement in creating products' }, { id: 'c', textEn: 'no customer role' }, { id: 'd', textEn: 'government planning' }], correctAnswer: 'b', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'Experience innovation means:', options: [{ id: 'a', textEn: 'focusing only on price' }, { id: 'b', textEn: 'creating an experience around a core product' }, { id: 'c', textEn: 'reducing quality' }, { id: 'd', textEn: 'stopping service' }], correctAnswer: 'b', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'Types of innovation range from:', options: [{ id: 'a', textEn: 'small to large buildings' }, { id: 'b', textEn: 'incremental to radical' }, { id: 'c', textEn: 'local to global staff' }, { id: 'd', textEn: 'sales to marketing' }], correctAnswer: 'b', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Innovation can be:', options: [{ id: 'a', textEn: 'stand-alone or system' }, { id: 'b', textEn: 'only system' }, { id: 'c', textEn: 'only stand-alone' }, { id: 'd', textEn: 'neither of them' }], correctAnswer: 'a', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'The innovation and entrepreneurship process has:', options: [{ id: 'a', textEn: 'two steps' }, { id: 'b', textEn: 'three steps' }, { id: 'c', textEn: 'four steps' }, { id: 'd', textEn: 'five steps' }], correctAnswer: 'c', marks: 1.0 }
        ]
    },
    entrepreneurship_quiz8: {
        id: 'entrepreneurship_quiz8',
        title: 'Quiz 8',
        titleAr: 'الكويز الثامن',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'The first step in the process is:', options: [{ id: 'a', textEn: 'capturing value' }, { id: 'b', textEn: 'recognizing the opportunity' }, { id: 'c', textEn: 'finding the resources' }, { id: 'd', textEn: 'developing the idea' }], correctAnswer: 'b', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'The second step in the process is:', options: [{ id: 'a', textEn: 'finding the resources' }, { id: 'b', textEn: 'selling the idea' }, { id: 'c', textEn: 'changing the market' }, { id: 'd', textEn: 'hiring customers' }], correctAnswer: 'a', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'The third step in the process is:', options: [{ id: 'a', textEn: 'ignoring feedback' }, { id: 'b', textEn: 'developing the idea' }, { id: 'c', textEn: 'reducing resources' }, { id: 'd', textEn: 'selecting competitors' }], correctAnswer: 'b', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'The fourth step in the process is:', options: [{ id: 'a', textEn: 'capturing value' }, { id: 'b', textEn: 'building factories' }, { id: 'c', textEn: 'opening branches' }, { id: 'd', textEn: 'changing ownership' }], correctAnswer: 'a', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'Opportunities may arise from:', options: [{ id: 'a', textEn: 'technological change' }, { id: 'b', textEn: 'market changes' }, { id: 'c', textEn: 'legislative pressure' }, { id: 'd', textEn: 'all of the above' }], correctAnswer: 'd', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Finding resources is mainly about:', options: [{ id: 'a', textEn: 'strategic choices' }, { id: 'b', textEn: 'closing projects' }, { id: 'c', textEn: 'avoiding knowledge' }, { id: 'd', textEn: 'canceling plans' }], correctAnswer: 'a', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'Developing the idea involves:', options: [{ id: 'a', textEn: 'market research and prototype testing' }, { id: 'b', textEn: 'stopping all research' }, { id: 'c', textEn: 'avoiding competitors' }, { id: 'd', textEn: 'removing creativity' }], correctAnswer: 'a', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'During implementation, organizations must balance:', options: [{ id: 'a', textEn: 'speed and fear' }, { id: 'b', textEn: 'creativity and control' }, { id: 'c', textEn: 'cost and silence' }, { id: 'd', textEn: 'marketing and sales' }], correctAnswer: 'b', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Capture value includes:', options: [{ id: 'a', textEn: 'protecting intellectual property' }, { id: 'b', textEn: 'learning from past experiences' }, { id: 'c', textEn: 'scaling ideas for social change' }, { id: 'd', textEn: 'all of the above' }], correctAnswer: 'd', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'Innovation needs:', options: [{ id: 'a', textEn: 'clear strategic leadership and direction' }, { id: 'b', textEn: 'an innovative organization' }, { id: 'c', textEn: 'proactive external connections' }, { id: 'd', textEn: 'all of the above' }], correctAnswer: 'd', marks: 1.0 }
        ]
    },
    entrepreneurship_quiz9: {
        id: 'entrepreneurship_quiz9',
        title: 'Quiz 9',
        titleAr: 'الكويز التاسع',
        icon: '📝',
        color: '#FFC107',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'Research suggests successful innovation management needs:', options: [{ id: 'a', textEn: 'understanding dimensions of innovation' }, { id: 'b', textEn: 'managing innovation as a process' }, { id: 'c', textEn: 'building capability' }, { id: 'd', textEn: 'all of the above' }], correctAnswer: 'd', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'Putting an innovation strategy involves:', options: [{ id: 'a', textEn: 'strategic analysis, strategic selection, strategic implementation' }, { id: 'b', textEn: 'idea, cost, product' }, { id: 'c', textEn: 'planning, staffing, advertising' }, { id: 'd', textEn: 'design, launch, closure' }], correctAnswer: 'a', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'Strategic analysis asks:', options: [{ id: 'a', textEn: 'what could we do?' }, { id: 'b', textEn: 'what did we sell?' }, { id: 'c', textEn: 'who resigned?' }, { id: 'd', textEn: 'when will we stop?' }], correctAnswer: 'a', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'Strategic selection asks:', options: [{ id: 'a', textEn: 'where are competitors?' }, { id: 'b', textEn: 'what are we going to do, and why?' }, { id: 'c', textEn: 'how many employees do we have?' }, { id: 'd', textEn: 'what was our past profit only?' }], correctAnswer: 'b', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'Strategic implementation asks:', options: [{ id: 'a', textEn: 'why do customers leave?' }, { id: 'b', textEn: 'how are we going to make it happen?' }, { id: 'c', textEn: 'where is the office?' }, { id: 'd', textEn: 'who invented the product?' }], correctAnswer: 'b', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'Strategic selection requires balancing:', options: [{ id: 'a', textEn: 'risks and rewards across a portfolio of projects' }, { id: 'b', textEn: 'salaries and attendance' }, { id: 'c', textEn: 'brands and colors' }, { id: 'd', textEn: 'markets and buildings' }], correctAnswer: 'a', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'A simple project plan in implementation helps identify:', options: [{ id: 'a', textEn: 'resources needed and timing' }, { id: 'b', textEn: 'employee birthdays' }, { id: 'c', textEn: 'competitor salaries' }, { id: 'd', textEn: 'office decoration' }], correctAnswer: 'a', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'Contingency plans are developed by:', options: [{ id: 'a', textEn: 'ignoring challenges' }, { id: 'b', textEn: 'anticipating major challenges and considering worst-case scenarios' }, { id: 'c', textEn: 'copying competitors only' }, { id: 'd', textEn: 'reducing communication' }], correctAnswer: 'b', marks: 1.0 }
        ]
    },
    info_sec_quiz1: {
        id: 'info_sec_quiz1',
        title: 'Quiz 1',
        titleAr: 'الكويز الأول',
        icon: '🔒',
        color: '#F44336',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'In the relational database model, a relation is best described as:',
                options: [
                    { id: 'a', textEn: 'A table consisting of tuples and attributes' },
                    { id: 'b', textEn: 'A set of attributes sharing a common domain' },
                    { id: 'c', textEn: 'A single record stored in a database' },
                    { id: 'd', textEn: 'A logical pointer to another table' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Which statement best characterizes an attribute in a relational database?',
                options: [
                    { id: 'a', textEn: 'It uniquely distinguishes one tuple from another' },
                    { id: 'b', textEn: 'It represents a column holding values of the same type' },
                    { id: 'c', textEn: 'It defines a relationship between two relations' },
                    { id: 'd', textEn: 'It stores a query result temporarily' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'What is the primary purpose of a primary key?',
                options: [
                    { id: 'a', textEn: 'To enforce access control policies' },
                    { id: 'b', textEn: 'To uniquely identify each tuple within a relation' },
                    { id: 'c', textEn: 'To optimize encryption performance' },
                    { id: 'd', textEn: 'To define relationships without constraints' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'SQL is best described as a language that is:',
                options: [
                    { id: 'a', textEn: 'Vendor-specific and implementation-dependent' },
                    { id: 'b', textEn: 'Standardized for defining and manipulating relational data' },
                    { id: 'c', textEn: 'Used exclusively for querying encrypted databases' },
                    { id: 'd', textEn: 'Limited to data retrieval operations' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Which SQL command is used to assign access privileges or roles to users?',
                options: [
                    { id: 'a', textEn: 'AUTHORIZE' },
                    { id: 'b', textEn: 'REGISTER' },
                    { id: 'c', textEn: 'DEFINE' },
                    { id: 'd', textEn: 'GRANT' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'An SQL injection attack that exploits forged HTTP headers is classified under which attack avenue?',
                options: [
                    { id: 'a', textEn: 'User input manipulation' },
                    { id: 'b', textEn: 'Server variables' },
                    { id: 'c', textEn: 'Second-order injection' },
                    { id: 'd', textEn: 'Physical user input' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Which SQL injection technique forces a conditional statement to always evaluate as true?',
                options: [
                    { id: 'a', textEn: 'Blind injection' },
                    { id: 'b', textEn: 'Tautology-based injection' },
                    { id: 'c', textEn: 'Piggybacked queries' },
                    { id: 'd', textEn: 'Illegal query injection' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Which countermeasure most directly prevents user input from altering the structure of an SQL statement?',
                options: [
                    { id: 'a', textEn: 'Query result filtering' },
                    { id: 'b', textEn: 'Parameterized queries' },
                    { id: 'c', textEn: 'Signature-based detection' },
                    { id: 'd', textEn: 'Database encryption' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which inference control approach attempts to stop sensitive information disclosure during query execution?',
                options: [
                    { id: 'a', textEn: 'Design-time inference detection' },
                    { id: 'b', textEn: 'Role hierarchy enforcement' },
                    { id: 'c', textEn: 'Query-time inference detection' },
                    { id: 'd', textEn: 'Attribute-level encryption' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'What is a key disadvantage of encrypting large portions of a database?',
                options: [
                    { id: 'a', textEn: 'Reduced availability due to stricter access controls' },
                    { id: 'b', textEn: 'Elimination of role-based authorization' },
                    { id: 'c', textEn: 'Increased complexity in key management and query processing' },
                    { id: 'd', textEn: 'Incompatibility with relational schemas' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            }
        ]
    },
    num_analysis_quiz1: {
        id: 'num_analysis_quiz1',
        title: 'Quiz 1',
        titleAr: 'الكويز الأول',
        icon: '📊',
        color: '#673AB7',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Given matrix A = [[-3, 0, 2, 5], [-2, 1, 0, -1], [4, 2, 6, 3], [3, -1, -4, -5]]. Then the CO_factor entry C₃₄ =',
                options: [
                    { id: 'a', textEn: '32' },
                    { id: 'b', textEn: '-55' },
                    { id: 'c', textEn: '55' },
                    { id: 'd', textEn: '-10' },
                    { id: 'e', textEn: '10' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'The value of x₁ using Cramer\'s Rule for the System: x₁ - 3x₂ + x₃ = 4, 2x₁ - x₂ = -2, 4x₁ - 3x₃ = 0',
                options: [
                    { id: 'a', textEn: 'x₁ = 2/11' },
                    { id: 'b', textEn: 'x₁ = -1/11' },
                    { id: 'c', textEn: 'x₁ = -30/11' },
                    { id: 'd', textEn: 'x₁ = 3/11' },
                    { id: 'e', textEn: 'x₁ = -38/11' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'The inverse of the matrix A = [[2, 6, 6], [2, 7, 6], [2, 7, 7]] is A⁻¹',
                options: [
                    { id: 'a', textEn: 'A⁻¹ = [[3/2, -11/10, -6/5], [-1, 1, 1], [-1/2, 7/10, 2/5]]' },
                    { id: 'b', textEn: 'A⁻¹ = [[1, 3, 1], [0, 1, -1], [-2, 2, 0]]' },
                    { id: 'c', textEn: 'A⁻¹ = [[7/2, 0, -3], [-1, 1, 0], [0, -1, 1]]' },
                    { id: 'd', textEn: 'A⁻¹ = [[1/3, 0, 1], [1/4, -3/4, 5], [13/100, 0, -9/100]]' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'The easiest choice to evaluate the determinant of the matrix A = [[-6, 0, 9, 1], [-2, 0, 0, -1], [4, 2, 0, 3], [3, -1, 0, 10]], Using C, Where C is the matrix of Cofactors is: |A|=',
                options: [
                    { id: 'a', textEn: '|A|=c₄₁a₄₁ + c₄₂a₄₂ + c₄₃a₄₃ + c₄₄a₄₄' },
                    { id: 'b', textEn: '|A|=c₁₂a₁₂ + c₂₂a₂₂ + c₃₂a₃₂ + c₄₂a₄₂' },
                    { id: 'c', textEn: '|A|=c₂₁a₂₁ + c₂₂a₂₂ + c₂₃a₂₃ + c₂₄a₂₄' },
                    { id: 'd', textEn: '|A|=c₁₃a₁₃ + c₂₃a₂₃ + c₃₃a₃₃ + c₄₃a₄₃' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'For the matrix A = [[2, 3], [-1, 5]] then A² + 4',
                options: [
                    { id: 'a', textEn: '[[5, 25], [-3, 26]]' },
                    { id: 'b', textEn: '[[8, 3], [-1, 29]]' },
                    { id: 'c', textEn: '[[8, 7], [3, 29]]' },
                    { id: 'd', textEn: '[[5, 21], [-7, 26]]' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            }
        ]
    },
    ai_programming_quiz1: {
        id: 'ai_programming_quiz1',
        title: 'Quiz 1',
        titleAr: 'الكويز الأول',
        icon: '🤖',
        color: '#009688',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'tf',
                questionEn: 'Python lists are immutable, meaning their elements cannot be changed after creation.',
                questionAr: 'القوائم في بايثون غير قابلة للتغيير، أي لا يمكن تغيير عناصرها بعد إنشائها.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 2,
                type: 'tf',
                questionEn: 'List indexing in Python starts from index 1.',
                questionAr: 'فهرسة القوائم في بايثون تبدأ من الفهرس 1.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 3,
                type: 'tf',
                questionEn: 'The slice my_list[2:5] includes the element at index 5.',
                questionAr: 'التقطيع my_list[2:5] يتضمن العنصر عند الفهرس 5.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 4,
                type: 'tf',
                questionEn: 'A tuple with one element must include a trailing comma to be recognized as a tuple.',
                questionAr: 'يجب أن يتضمن الـ tuple الذي يحتوي على عنصر واحد فاصلة في النهاية ليتم التعرف عليه كـ tuple.',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 5,
                type: 'tf',
                questionEn: 'You can delete an entire tuple using the del keyword.',
                questionAr: 'يمكنك حذف tuple بالكامل باستخدام الكلمة المفتاحية del.',
                correctAnswer: true,
                marks: 1.0
            }
        ]
    },
    ml_midterm: {
        id: 'ml_midterm',
        title: 'Midterm Past Papers',
        titleAr: 'أسئلة سنوات ميد',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Which of the following is an example of a supervised learning task?',
                options: [
                    { id: 'a', textEn: 'Clustering customers into groups' },
                    { id: 'b', textEn: 'Predicting house prices based on size and location' },
                    { id: 'c', textEn: 'Finding associations in market basket data' },
                    { id: 'd', textEn: 'Reducing the number of features in a dataset' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'In binary logistic regression ..................?',
                options: [
                    { id: 'a', textEn: 'The dependent variable is continuous' },
                    { id: 'b', textEn: 'The dependent variable consists of two categories' },
                    { id: 'c', textEn: 'The dependent variable is divided into two equal subcategories' },
                    { id: 'd', textEn: 'None of the answers' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: '<div style="font-family: Arial, sans-serif; line-height: 1.6;"><p style="margin-bottom: 15px;">Below are three graphs (A, B, and C) showing the relationship between the cost function <strong>J(θ)</strong> and the number of iterations:</p><div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap;"><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #2196F3;">Graph A</div><svg width="120" height="100" style="border: 2px solid #2196F3; border-radius: 8px; background: white;"><path d="M 10 15 Q 25 35, 40 50 Q 55 58, 110 60" stroke="#2196F3" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Rapid decrease → plateau</div></div><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #4CAF50;">Graph B</div><svg width="120" height="100" style="border: 2px solid #4CAF50; border-radius: 8px; background: white;"><path d="M 10 15 Q 40 30, 70 50 Q 90 65, 110 75" stroke="#4CAF50" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Steady curved decrease</div></div><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #F44336;">Graph C</div><svg width="120" height="100" style="border: 2px solid #F44336; border-radius: 8px; background: white;"><path d="M 10 75 Q 40 65, 70 50 Q 90 35, 110 25" stroke="#F44336" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Cost increases</div></div></div><p style="margin-top: 20px; padding: 12px; background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; border-radius: 4px; color: inherit;">Suppose <strong style="font-family: \'Courier New\', monospace;">l1, l2, and l3</strong> are the three learning rates for A, B, and C, respectively. Which of the following is true about <strong style="font-family: \'Courier New\', monospace;">l1, l2, and l3</strong>?</p></div>',
                options: [
                    { id: 'a', textEn: 'l1 > l2 > l3' },
                    { id: 'b', textEn: 'l2 < l1 < l3' },
                    { id: 'c', textEn: 'l1 = l2 = l3' },
                    { id: 'd', textEn: 'None' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'In the bias-variance tradeoff, a model with high variance is most likely to:',
                options: [
                    { id: 'a', textEn: 'Underfit the training data' },
                    { id: 'b', textEn: 'Overfit the training data' },
                    { id: 'c', textEn: 'Have a high bias' },
                    { id: 'd', textEn: 'None of the answers' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'How many coefficients do you need to estimate in a simple linear regression model (One independent variable)?',
                options: [
                    { id: 'a', textEn: '1' },
                    { id: 'b', textEn: '2' },
                    { id: 'c', textEn: '3' },
                    { id: 'd', textEn: '4' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: '.................. is a technique to standardize the independent features present in the data in a fixed range.',
                options: [
                    { id: 'a', textEn: 'Normalization' },
                    { id: 'b', textEn: 'Regularization' },
                    { id: 'c', textEn: 'Optimization' },
                    { id: 'd', textEn: 'Validation' }
                ],
                correctAnswer: 'a',
                marks: 3.0
            }
        ]
    },
    ai_programming_quiz1: {
        id: 'ai_programming_quiz1',
        title: 'Quiz 1',
        titleAr: 'الكويز الأول',
        icon: '🤖',
        color: '#009688',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'tf',
                questionEn: 'Python lists are immutable, meaning their elements cannot be changed after creation.',
                questionAr: 'القوائم في بايثون غير قابلة للتغيير، أي لا يمكن تغيير عناصرها بعد إنشائها.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 2,
                type: 'tf',
                questionEn: 'List indexing in Python starts from index 1.',
                questionAr: 'فهرسة القوائم في بايثون تبدأ من الفهرس 1.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 3,
                type: 'tf',
                questionEn: 'The slice my_list[2:5] includes the element at index 5.',
                questionAr: 'التقطيع my_list[2:5] يتضمن العنصر عند الفهرس 5.',
                correctAnswer: false,
                marks: 2.0
            },
            {
                id: 4,
                type: 'tf',
                questionEn: 'A tuple with one element must include a trailing comma to be recognized as a tuple.',
                questionAr: 'يجب أن يتضمن الـ tuple الذي يحتوي على عنصر واحد فاصلة في النهاية ليتم التعرف عليه كـ tuple.',
                correctAnswer: true,
                marks: 2.0
            },
            {
                id: 5,
                type: 'tf',
                questionEn: 'You can delete an entire tuple using the del keyword.',
                questionAr: 'يمكنك حذف tuple بالكامل باستخدام الكلمة المفتاحية del.',
                correctAnswer: true,
                marks: 1.0
            }
        ]
    },
    ml_midterm: {
        id: 'ml_midterm',
        title: 'Midterm Past Papers',
        titleAr: 'أسئلة سنوات ميد',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Which of the following is an example of a supervised learning task?',
                options: [
                    { id: 'a', textEn: 'Clustering customers into groups' },
                    { id: 'b', textEn: 'Predicting house prices based on size and location' },
                    { id: 'c', textEn: 'Finding associations in market basket data' },
                    { id: 'd', textEn: 'Reducing the number of features in a dataset' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'In binary logistic regression ..................?',
                options: [
                    { id: 'a', textEn: 'The dependent variable is continuous' },
                    { id: 'b', textEn: 'The dependent variable consists of two categories' },
                    { id: 'c', textEn: 'The dependent variable is divided into two equal subcategories' },
                    { id: 'd', textEn: 'None of the answers' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: '<div style="font-family: Arial, sans-serif; line-height: 1.6;"><p style="margin-bottom: 15px;">Below are three graphs (A, B, and C) showing the relationship between the cost function <strong>J(θ)</strong> and the number of iterations:</p><div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap;"><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #2196F3;">Graph A</div><svg width="120" height="100" style="border: 2px solid #2196F3; border-radius: 8px; background: white;"><path d="M 10 15 Q 25 35, 40 50 Q 55 58, 110 60" stroke="#2196F3" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Rapid decrease → plateau</div></div><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #4CAF50;">Graph B</div><svg width="120" height="100" style="border: 2px solid #4CAF50; border-radius: 8px; background: white;"><path d="M 10 15 Q 40 30, 70 50 Q 90 65, 110 75" stroke="#4CAF50" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Steady curved decrease</div></div><div style="text-align: center; margin: 10px;"><div style="font-weight: bold; margin-bottom: 10px; color: #F44336;">Graph C</div><svg width="120" height="100" style="border: 2px solid #F44336; border-radius: 8px; background: white;"><path d="M 10 75 Q 40 65, 70 50 Q 90 35, 110 25" stroke="#F44336" stroke-width="2.5" fill="none"/><line x1="10" y1="90" x2="110" y2="90" stroke="#333" stroke-width="1.5"/><line x1="10" y1="10" x2="10" y2="90" stroke="#333" stroke-width="1.5"/><text x="60" y="98" font-size="9" fill="#333" text-anchor="middle">Iterations</text><text x="5" y="50" font-size="9" fill="#333" transform="rotate(-90 5 50)" text-anchor="middle">J(θ)</text></svg><div style="font-size: 11px; margin-top: 5px;">Cost increases</div></div></div><p style="margin-top: 20px; padding: 12px; background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; border-radius: 4px; color: inherit;">Suppose <strong style="font-family: \'Courier New\', monospace;">l1, l2, and l3</strong> are the three learning rates for A, B, and C, respectively. Which of the following is true about <strong style="font-family: \'Courier New\', monospace;">l1, l2, and l3</strong>?</p></div>',
                options: [
                    { id: 'a', textEn: 'l1 > l2 > l3' },
                    { id: 'b', textEn: 'l2 < l1 < l3' },
                    { id: 'c', textEn: 'l1 = l2 = l3' },
                    { id: 'd', textEn: 'None' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'In the bias-variance tradeoff, a model with high variance is most likely to:',
                options: [
                    { id: 'a', textEn: 'Underfit the training data' },
                    { id: 'b', textEn: 'Overfit the training data' },
                    { id: 'c', textEn: 'Have a high bias' },
                    { id: 'd', textEn: 'None of the answers' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'How many coefficients do you need to estimate in a simple linear regression model (One independent variable)?',
                options: [
                    { id: 'a', textEn: '1' },
                    { id: 'b', textEn: '2' },
                    { id: 'c', textEn: '3' },
                    { id: 'd', textEn: '4' }
                ],
                correctAnswer: 'b',
                marks: 3.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: '.................. is a technique to standardize the independent features present in the data in a fixed range.',
                options: [
                    { id: 'a', textEn: 'Normalization' },
                    { id: 'b', textEn: 'Regularization' },
                    { id: 'c', textEn: 'Optimization' },
                    { id: 'd', textEn: 'Validation' }
                ],
                correctAnswer: 'a',
                marks: 3.0
            }
        ]
    },
    ml_final: {
        id: 'ml_final',
        title: 'Final Past Papers',
        titleAr: 'أسئلة سنوات فاينل',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        questions: []
    },
    ml_quizzes: {
        id: 'ml_quizzes',
        title: 'Quizzes',
        titleAr: 'كويزات',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'In deep networks, why is ReLU often preferred over sigmoid in hidden layers?',
                options: [
                    { id: 'a', textEn: 'ReLU guarantees reaching the global minimum' },
                    { id: 'b', textEn: 'Sigmoid\'s derivative becomes very small away from the origin → slow learning (vanishing gradients)' },
                    { id: 'c', textEn: 'Sigmoid cannot model non-linear relationships' },
                    { id: 'd', textEn: 'ReLU outputs probabilities that sum to 1' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'A neural network uses a softmax output layer for a 3-class classification problem. The input logits to the softmax layer are: z = [2.33, -1.46, 0.56]. Which of the following options best represents the softmax output probabilities, and what is the predicted class?',
                options: [
                    { id: 'a', textEn: '[0.33,0.33,0.33] → Class 2' },
                    { id: 'b', textEn: '[0.84,0.02,0.14] → Class 1' },
                    { id: 'c', textEn: '[0.60,0.10,0.30] → Class 1' },
                    { id: 'd', textEn: '[0.14,0.02,0.84] → Class 3' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Why is the binary step activation a bad choice in multi-layer networks trained with backpropagation?',
                options: [
                    { id: 'a', textEn: 'It always causes exploding gradients' },
                    { id: 'b', textEn: 'It requires softmax in the output layer' },
                    { id: 'c', textEn: 'Its derivative is zero, so weights won\'t update during backpropagation' },
                    { id: 'd', textEn: 'It only works for multi-class problems' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'Which statement best explains the vanishing gradient issue (as described) and a listed solution?',
                options: [
                    { id: 'a', textEn: 'Gradients shrink only in CNNs; solution is softmax' },
                    { id: 'b', textEn: 'Gradients grow across layers; solution is dropout' },
                    { id: 'c', textEn: 'Gradients shrink as they propagate back (especially with sigmoid); solution is LSTM' },
                    { id: 'd', textEn: 'Gradients vanish because the learning rate is always zero; solution is more epochs' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'For a binary random variable, the entropy is maximized when:',
                options: [
                    { id: 'a', textEn: 'The probability of success is 1.' },
                    { id: 'b', textEn: 'The probability of success is 0.' },
                    { id: 'c', textEn: 'The probability of success is 0.5.' },
                    { id: 'd', textEn: 'The probabilities are skewed toward one outcome.' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Which statement is true regarding data farther away from the mean in a Gaussian distribution?',
                options: [
                    { id: 'a', textEn: 'Data distribution is always skewed to the right.' },
                    { id: 'b', textEn: 'Data farther away from the mean are more frequent.' },
                    { id: 'c', textEn: 'Frequency is constant regardless of distance from the mean.' },
                    { id: 'd', textEn: 'Data farther away from the mean are less frequent.' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'For a binomial distribution B(x;8,0.4) what does the "0.4" represent?',
                options: [
                    { id: 'a', textEn: 'Probability of success' },
                    { id: 'b', textEn: 'Probability of failure' },
                    { id: 'c', textEn: 'Number of successes' },
                    { id: 'd', textEn: 'Number of trials' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Given f(x)=x^2, determine the convexity of this function:',
                options: [
                    { id: 'a', textEn: 'Convex, since f\'\'(x)=2>0' },
                    { id: 'b', textEn: 'Neither convex nor concave' },
                    { id: 'c', textEn: 'Linear' },
                    { id: 'd', textEn: 'Concave, since f\'\'(x)=2<0' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'If the probabilities of outcomes for three players (A, B, C) are respectively 0.2, 0.3, and 0.5, which formula correctly calculates the multinomial probability of player A winning 1 game, player B winning 2 games, and player C winning 3 games out of 6?',
                options: [
                    { id: 'a', textEn: '(6!/(2!2!2!))(0.2³)(0.3²)(0.5¹)' },
                    { id: 'b', textEn: '(6!/(1!1!4!))(0.2²)(0.3³)(0.5¹)' },
                    { id: 'c', textEn: '(6!/(3!2!1!))(0.2¹)(0.3³)(0.5²)' },
                    { id: 'd', textEn: '(6!/(1!2!3!))(0.2¹)(0.3²)(0.5³)' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            }
        ]
    },
    cyber_iot_quiz: {
        id: 'cyber_iot_quiz',
        title: 'IoT Security Quiz',
        titleAr: 'كويز أمن إنترنت الأشياء',
        icon: '🌐',
        color: '#607D8B',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Which cryptographic method ensures integrity and authenticity of a message?',
                options: [
                    { id: 'a', textEn: 'SSL/TLS' },
                    { id: 'b', textEn: 'Asymmetric encryption' },
                    { id: 'c', textEn: 'Hashing only' },
                    { id: 'd', textEn: 'Message Authentication Code (MAC)' },
                    { id: 'e', textEn: 'Obfuscation' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Which cryptographic protocol is widely used in securing network communications?',
                options: [
                    { id: 'a', textEn: 'SSL/TLS' },
                    { id: 'b', textEn: 'HMAC' },
                    { id: 'c', textEn: 'SGD' },
                    { id: 'd', textEn: 'SHA-1' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Which of the following is an example of a named identity?',
                options: [
                    { id: 'a', textEn: 'IPv6 address' },
                    { id: 'b', textEn: 'RFID tag' },
                    { id: 'c', textEn: 'QR code' },
                    { id: 'd', textEn: 'User account' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'Which method ensures anonymity of identities while authenticating?',
                options: [
                    { id: 'a', textEn: 'Static encryption' },
                    { id: 'b', textEn: 'Password hashing' },
                    { id: 'c', textEn: 'Use of temporary random mappings (TMSI)' },
                    { id: 'd', textEn: 'Plaintext passwords' },
                    { id: 'e', textEn: 'Hard attachment' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Which standard defines public key certificate formats?',
                options: [
                    { id: 'a', textEn: 'ISO 9001' },
                    { id: 'b', textEn: 'X.509' },
                    { id: 'c', textEn: 'WPA3' },
                    { id: 'd', textEn: 'SHA-512' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Why is probabilistic encryption useful in anonymous identity verification?',
                options: [
                    { id: 'a', textEn: 'It ensures the same ciphertext each time' },
                    { id: 'b', textEn: 'It is deterministic' },
                    { id: 'c', textEn: 'It avoids random numbers' },
                    { id: 'd', textEn: 'It uses passwords only' },
                    { id: 'e', textEn: 'It hides activity links by producing different ciphertexts' }
                ],
                correctAnswer: 'e',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Why does lightweight PKI still pose challenges in IoT?',
                options: [
                    { id: 'a', textEn: 'WTLS certificates are still large for resource-constrained devices' },
                    { id: 'b', textEn: 'WTLS lacks CRL' },
                    { id: 'c', textEn: 'WTLS uses IPv6' },
                    { id: 'd', textEn: 'WTLS doesn’t scale' },
                    { id: 'e', textEn: 'WTLS avoids encryption' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'Which type of attack is easier in IoT because of extensive wireless communication?',
                options: [
                    { id: 'a', textEn: 'SQL Injection' },
                    { id: 'b', textEn: 'Eavesdropping' },
                    { id: 'c', textEn: 'Flooding' },
                    { id: 'd', textEn: 'buffer overflow' },
                    { id: 'e', textEn: 'Spoofing' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which mode of block cipher is suitable in wireless IoT for byte encryption?',
                options: [
                    { id: 'a', textEn: 'ICH' },
                    { id: 'b', textEn: 'RSA' },
                    { id: 'c', textEn: 'CTR (or stream cipher)' },
                    { id: 'd', textEn: 'HMAC' },
                    { id: 'e', textEn: 'SHA-256' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'Which countermeasure raises chip analysis difficulty?',
                options: [
                    { id: 'a', textEn: 'Side-channel protection' },
                    { id: 'b', textEn: 'Shared keying' },
                    { id: 'c', textEn: 'X.509 revocation' },
                    { id: 'd', textEn: 'Normancy' },
                    { id: 'e', textEn: 'Password hashing' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 11,
                type: 'mcq',
                questionEn: 'Why is a replay attack more severe in IoT than traditional IT?',
                options: [
                    { id: 'a', textEn: 'Replay doesn’t affect IoT' },
                    { id: 'b', textEn: 'AES is weak' },
                    { id: 'c', textEn: 'IoT has strong firewalls' },
                    { id: 'd', textEn: 'IT systems lack counters' },
                    { id: 'e', textEn: 'Control commands can be re-executed at wrong times' }
                ],
                correctAnswer: 'e',
                marks: 1.0
            },
            {
                id: 12,
                type: 'mcq',
                questionEn: 'Which layer of IoT architecture represents WANs?',
                options: [
                    { id: 'a', textEn: 'Application' },
                    { id: 'b', textEn: 'Network' },
                    { id: 'c', textEn: 'Perception' },
                    { id: 'd', textEn: 'Processing' },
                    { id: 'e', textEn: 'Transport' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 13,
                type: 'mcq',
                questionEn: 'Which SIM alternative was proposed to solve size issues in IoT?',
                options: [
                    { id: 'a', textEn: 'e-SIM' },
                    { id: 'b', textEn: 'MicroSD' },
                    { id: 'c', textEn: 'TPM' },
                    { id: 'd', textEn: 'QR-code' },
                    { id: 'e', textEn: 'NPC card' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 14,
                type: 'mcq',
                questionEn: 'Which LoRa class consumes the least energy?',
                options: [
                    { id: 'a', textEn: 'Class B' },
                    { id: 'b', textEn: 'Class C' },
                    { id: 'c', textEn: 'Class A' },
                    { id: 'd', textEn: 'Hybrid' },
                    { id: 'e', textEn: 'Random' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 15,
                type: 'mcq',
                questionEn: 'Why is tunnel mode in IPSec suitable for VPNs?',
                options: [
                    { id: 'a', textEn: 'It encapsulates entire IP packets' },
                    { id: 'b', textEn: 'It skips encryption' },
                    { id: 'c', textEn: 'It uses HTTP only' },
                    { id: 'd', textEn: 'It ignores payload' },
                    { id: 'e', textEn: 'It compresses DNS' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 16,
                type: 'mcq',
                questionEn: 'Why is 5G expected to be important for IoT?',
                options: [
                    { id: 'a', textEn: 'Cheap SIM cloning' },
                    { id: 'b', textEn: 'No encryption' },
                    { id: 'c', textEn: 'Wide bandwidth & low latency' },
                    { id: 'd', textEn: 'Replaces all LPWANs' },
                    { id: 'e', textEn: 'Uses 2G keys' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 17,
                type: 'mcq',
                questionEn: 'What is the main security risk of DAC (Discretionary Access Control)?',
                options: [
                    { id: 'a', textEn: 'Weak key length' },
                    { id: 'b', textEn: 'Too strict for public systems' },
                    { id: 'c', textEn: 'No role-based control' },
                    { id: 'd', textEn: 'Mandatory encryption' },
                    { id: 'e', textEn: 'Vulnerable to Trojan horse granting permissions' }
                ],
                correctAnswer: 'e',
                marks: 1.0
            },
            {
                id: 19,
                type: 'mcq',
                questionEn: 'Which REALC (RBAC/Least Privilege) principle grants minimum necessary rights for a session?',
                options: [
                    { id: 'a', textEn: 'Daily separation' },
                    { id: 'b', textEn: 'Confidential' },
                    { id: 'c', textEn: 'Defined right' },
                    { id: 'd', textEn: 'Top secret' },
                    { id: 'e', textEn: 'Minimum right' }
                ],
                correctAnswer: 'e',
                marks: 1.0
            },
            {
                id: 20,
                type: 'mcq',
                questionEn: 'What is the IoT processing layer mainly implemented as?',
                options: [
                    { id: 'a', textEn: 'Application software' },
                    { id: 'b', textEn: 'Firewalls' },
                    { id: 'c', textEn: 'Virtual LANs' },
                    { id: 'd', textEn: 'Cloud computing platforms' },
                    { id: 'e', textEn: 'Edge routers' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 21,
                type: 'mcq',
                questionEn: 'Why is internal attack prevention challenging?',
                options: [
                    { id: 'a', textEn: 'Insiders may have legitimate high privileges' },
                    { id: 'b', textEn: 'No encryption exists' },
                    { id: 'c', textEn: 'Access control is disabled' },
                    { id: 'd', textEn: 'Firewalls stop insiders' },
                    { id: 'e', textEn: 'SQL databases cannot be secured' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 22,
                type: 'mcq',
                questionEn: 'Which LPWAN uses AES128 in counter mode for data confidentiality?',
                options: [
                    { id: 'a', textEn: 'Sigfox' },
                    { id: 'b', textEn: 'LoRa' },
                    { id: 'c', textEn: 'NB-IoT' },
                    { id: 'd', textEn: 'LTE' },
                    { id: 'e', textEn: 'GSM' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 23,
                type: 'mcq',
                questionEn: 'Why are perception layer threats often more severe than in IT systems?',
                options: [
                    { id: 'a', textEn: 'Because IoT devices connect data to physical operations' },
                    { id: 'b', textEn: 'Because IoT devices have faster CPUs' },
                    { id: 'c', textEn: 'Because IT lacks wireless' },
                    { id: 'd', textEn: 'Because they are always encrypted' },
                    { id: 'e', textEn: 'Because IT systems cannot be attacked' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 24,
                type: 'mcq',
                questionEn: 'What is the goal of an energy exhaustion attack?',
                options: [
                    { id: 'a', textEn: 'Crash servers' },
                    { id: 'b', textEn: 'Delete keys' },
                    { id: 'c', textEn: 'Drain device batteries' },
                    { id: 'd', textEn: 'Alter identities' },
                    { id: 'e', textEn: 'Capture wireless frames' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 25,
                type: 'mcq',
                questionEn: 'Which biometric is typically used as “something you are”?',
                options: [
                    { id: 'a', textEn: 'RFID tag' },
                    { id: 'b', textEn: 'Password' },
                    { id: 'c', textEn: 'Fingerprint' },
                    { id: 'd', textEn: 'IPv6 address' },
                    { id: 'e', textEn: 'OTP' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 26,
                type: 'mcq',
                questionEn: 'Which of the following is a key characteristic of Low Power Wide Area Networks (LPWANs)?',
                options: [
                    { id: 'a', textEn: 'Low data rates and long-range transmission' },
                    { id: 'b', textEn: 'High bandwidth and low latency' },
                    { id: 'c', textEn: 'Primarily used for video streaming' },
                    { id: 'd', textEn: 'Requires a mesh network topology' },
                    { id: 'e', textEn: 'Operates only on licensed spectrum' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 27,
                type: 'mcq',
                questionEn: 'What is the main technological difference between LoRa and NB-IOT regarding spectrum usage?',
                options: [
                    { id: 'a', textEn: 'Both use exclusively unlicensed spectrum' },
                    { id: 'b', textEn: 'Their spectrum usage is identical' },
                    { id: 'c', textEn: 'LoRa uses licensed spectrum; NB-IOT uses unlicensed' },
                    { id: 'd', textEn: 'LoRa uses unlicensed spectrum; NB-IOT uses licensed' },
                    { id: 'e', textEn: 'Both use exclusively licensed spectrum' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 28,
                type: 'mcq',
                questionEn: 'What is a primary security vulnerability that was present in 2G (GSM) networks but was addressed in 3G?',
                options: [
                    { id: 'a', textEn: 'Lack of data encryption' },
                    { id: 'b', textEn: 'The size of the SIM card' },
                    { id: 'c', textEn: 'Use of weak random number generators' },
                    { id: 'd', textEn: 'Inability to generate session keys' },
                    { id: 'e', textEn: 'Lack of mutual authentication (no network authentication)' }
                ],
                correctAnswer: 'e',
                marks: 1.0
            },
            {
                id: 29,
                type: 'mcq',
                questionEn: 'In the SSL/TLS handshake protocol, what is the purpose of the random number generated by the client?',
                options: [
                    { id: 'a', textEn: 'To authenticate the client\'s identity to the server' },
                    { id: 'b', textEn: 'To establish the TCP connection' },
                    { id: 'c', textEn: 'To act as a nonce and to generate the session keys' },
                    { id: 'd', textEn: 'To encrypt the server\'s public key certificate' },
                    { id: 'e', textEn: 'To select the cipher suite from the list' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 30,
                type: 'mcq',
                questionEn: 'In the TCP/IP model, where does the SSL/TLS protocol primarily operate?',
                options: [
                    { id: 'a', textEn: 'Between the Transport and Application layers' },
                    { id: 'b', textEn: 'It replaces the Transport layer' },
                    { id: 'c', textEn: 'Between the Network and Transport layers' },
                    { id: 'd', textEn: 'At the Network Interface layer' },
                    { id: 'e', textEn: 'Exclusively at the Application layer' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            }
        ]
    },
    biometrics_security_quiz1: {
        id: 'biometrics_security_quiz1',
        title: 'Quiz 1: Sensing & Image Processing',
        titleAr: 'الكويز الأول: الاستشعار ومعالجة الصور',
        icon: '👁️',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'tf',
                questionEn: 'Optical fingerprint sensors use frustrated total internal reflection where ridges scatter light and valleys reflect light.',
                correctAnswer: true,
                marks: 0.5
            },
            {
                id: 2,
                type: 'tf',
                questionEn: 'Capacitive sensors work better than optical sensors when fingers are wet or dirty.',
                correctAnswer: false,
                marks: 0.5
            },
            {
                id: 3,
                type: 'tf',
                questionEn: 'A histogram that shows a single narrow peak indicates a high-quality fingerprint image with good contrast.',
                correctAnswer: false,
                marks: 0.5
            },
            {
                id: 4,
                type: 'tf',
                questionEn: 'Median filtering is preferred over mean filtering for fingerprint preprocessing because it preserves edges while removing noise.',
                correctAnswer: true,
                marks: 0.5
            },
            {
                id: 5,
                type: 'tf',
                questionEn: 'Ultrasonic sensors can capture fingerprint patterns even when the finger has dirt or moisture on it.',
                correctAnswer: true,
                marks: 0.5
            },
            {
                id: 6,
                type: 'tf',
                questionEn: 'The Canny edge detector produces thick, blurry edges that are difficult to use for ridge extraction.',
                correctAnswer: false,
                marks: 0.5
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'Which filter would be MOST suitable for removing salt-and-pepper noise from a fingerprint image while preserving ridge edges?',
                options: [
                    { id: 'a', textEn: 'Mean filter' },
                    { id: 'b', textEn: 'Gaussian filter' },
                    { id: 'c', textEn: 'Median filter' },
                    { id: 'd', textEn: 'Sobel filter' }
                ],
                correctAnswer: 'c',
                marks: 0.5
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'What does a bimodal histogram in a fingerprint image typically indicate?',
                options: [
                    { id: 'a', textEn: 'The image is overexposed' },
                    { id: 'b', textEn: 'Good separation between dark ridges and light valleys' },
                    { id: 'c', textEn: 'The sensor is malfunctioning' },
                    { id: 'd', textEn: 'The finger is too wet' }
                ],
                correctAnswer: 'b',
                marks: 0.5
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which sensor technology is MOST vulnerable to "gummy finger" spoof attacks using silicone replicas?',
                options: [
                    { id: 'a', textEn: 'Optical sensors' },
                    { id: 'b', textEn: 'Capacitive sensors' },
                    { id: 'c', textEn: 'Ultrasonic sensors' },
                    { id: 'd', textEn: 'Thermal sensors' }
                ],
                correctAnswer: 'a',
                marks: 0.5
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'What is the primary purpose of the orientation field in fingerprint processing?',
                options: [
                    { id: 'a', textEn: 'To measure finger pressure' },
                    { id: 'b', textEn: 'To represent local ridge direction for Gabor filtering' },
                    { id: 'c', textEn: 'To detect sweat pores' },
                    { id: 'd', textEn: 'To count total ridges' }
                ],
                correctAnswer: 'b',
                marks: 0.5
            }
        ]
    },
    biometrics_security_quiz2: {
        id: 'biometrics_security_quiz2',
        title: 'Quiz 2: Biometric Sensing & Image Processing (2)',
        titleAr: 'الكويز الثاني',
        icon: '👁️',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'tf', questionEn: 'Optical fingerprint sensors use frustrated total internal reflection, in which ridges scatter light and valleys reflect it.', correctAnswer: true, marks: 2.0, feedbackEn: 'Optical FTIR: ridges scatter, valleys reflect' },
            { id: 2, type: 'tf', questionEn: 'A histogram with a single, narrow peak indicates a high-quality fingerprint image with good contrast.', correctAnswer: false, marks: 2.0, feedbackEn: 'Narrow peak = low contrast, poor quality' },
            { id: 3, type: 'tf', questionEn: 'Ultrasonic sensors can capture fingerprint patterns even when the finger is dirty or moist.', correctAnswer: true, marks: 2.0, feedbackEn: 'Ultrasonic sensors penetrate dirt and moisture.' },
            { id: 4, type: 'tf', questionEn: 'The median filter is most suitable for removing salt-and-pepper noise from a fingerprint image while preserving ridge edges.', correctAnswer: true, marks: 2.0, feedbackEn: 'The Median Filter handles outliers (salt = white, bright pixels; pepper = black pixels) without blurring the surrounding pixels.' },
            { id: 5, type: 'tf', questionEn: 'The Canny edge detector produces thick, blurry edges that are difficult to use for ridge extraction.', correctAnswer: false, marks: 2.0, feedbackEn: 'Canny produces thin, clean edges' }
        ]
    },
    biometrics_security_quiz3: {
        id: 'biometrics_security_quiz3',
        title: 'Quiz 3: Performance & Evaluation',
        titleAr: 'الكويز الثالث',
        icon: '👁️',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Why are biometric systems considered probabilistic rather than deterministic?',
                options: [
                    { id: 'a', textEn: 'Because they use passwords as backup' },
                    { id: 'b', textEn: 'Because they use thresholds and scores instead of exact matches' },
                    { id: 'c', textEn: 'Because they always produce the same result for the same user' },
                    { id: 'd', textEn: 'Because they require multiple attempts to work' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'What does False Acceptance Rate (FAR) measure?',
                options: [
                    { id: 'a', textEn: 'The proportion of users who cannot enroll' },
                    { id: 'b', textEn: 'The proportion of impostor attempts that are incorrectly accepted' },
                    { id: 'c', textEn: 'The rate at which genuine users are rejected' },
                    { id: 'd', textEn: 'The rate of sensor failures' }
                ],
                correctAnswer: 'b',
                marks: 2.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'If a biometric system has a high threshold (very strict), what happens to FAR and FRR?',
                options: [
                    { id: 'a', textEn: 'FAR decreases, FRR increases' },
                    { id: 'b', textEn: 'Both FAR and FRR decrease' },
                    { id: 'c', textEn: 'Both FAR and FRR increase' },
                    { id: 'd', textEn: 'FAR increases, FRR decreases' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'The Equal Error Rate (EER) is defined as:',
                options: [
                    { id: 'a', textEn: 'The point where FRR is zero' },
                    { id: 'b', textEn: 'The point where FAR is zero' },
                    { id: 'c', textEn: 'The average of FAR and FRR' },
                    { id: 'd', textEn: 'The point where FAR equals FRR' }
                ],
                correctAnswer: 'd',
                marks: 2.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'In a large-scale identification system with 10,000 users and FMR = 0.01%, the approximate False Positive Identification Rate (FPIR) is:',
                options: [
                    { id: 'a', textEn: '63%' },
                    { id: 'b', textEn: '1%' },
                    { id: 'c', textEn: '0.01%' },
                    { id: 'd', textEn: '10%' }
                ],
                correctAnswer: 'a',
                marks: 2.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Explain the difference between FAR and FRR in the context of a smartphone fingerprint unlock. Which one would you prioritize and why?',
                options: [
                    { id: 'a', textEn: 'FAR wrongly accepts strangers. FRR wrongly rejects the actual owner. Prioritize low FRR for user convenience.' },
                    { id: 'b', textEn: 'FAR is false rejection. FRR is false acceptance. Prioritize low FAR.' },
                    { id: 'c', textEn: 'They are identical measures. Neither should be prioritized.' },
                    { id: 'd', textEn: 'FRR applies only to banks, FAR applies to phones. Prioritize FAR.' }
                ],
                correctAnswer: 'a',
                marks: 5.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: "What is Doddington's Zoo, and why is it important for biometric system design?",
                options: [
                    { id: 'a', textEn: 'Classifies users into Sheep, Goats, Lambs, and Wolves to prove biometric systems aren’t "one size fits all."' },
                    { id: 'b', textEn: 'It is a hardware testing environment for new ultrasonic biometric sensors.' },
                    { id: 'c', textEn: 'It proves that all users behave identically in biometric systems.' },
                    { id: 'd', textEn: 'It is an AI algorithm used for face recognition in wildlife.' }
                ],
                correctAnswer: 'a',
                marks: 5.0
            }
        ]
    },
    biometrics_security_quiz4: {
        id: 'biometrics_security_quiz4',
        title: 'Quiz 4: Attack Vectors & System Security',
        titleAr: 'الكويز الرابع',
        icon: '👁️',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'tf',
                questionEn: 'A simple blink detector can be fooled by a pre-recorded video.',
                correctAnswer: true,
                marks: 1.0
            },
            {
                id: 2,
                type: 'matching',
                questionEn: `Please match the correct word in the empty spaces.<br/>
<div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <svg width="100%" height="100%" viewBox="0 0 650 280" style="max-width: 650px; background: #fafafa; border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-family: system-ui, sans-serif;">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#666" />
      </marker>
    </defs>
    
    <rect x="20" y="70" width="110" height="50" rx="8" fill="#fff" stroke="#666" stroke-width="2" />
    <text x="75" y="101" font-size="16" font-weight="600" text-anchor="middle" fill="#444">Sensor</text>
    
    <rect x="170" y="70" width="130" height="50" rx="8" fill="#fff" stroke="#666" stroke-width="2" />
    <text x="235" y="101" font-size="16" font-weight="600" text-anchor="middle" fill="#444">Feature Extract</text>
    
    <rect x="340" y="70" width="100" height="50" rx="8" fill="#fff" stroke="#666" stroke-width="2" />
    <text x="390" y="101" font-size="16" font-weight="600" text-anchor="middle" fill="#444">Matcher</text>
    
    <rect x="480" y="70" width="100" height="50" rx="8" fill="#fff" stroke="#666" stroke-width="2" />
    <text x="530" y="101" font-size="16" font-weight="600" text-anchor="middle" fill="#444">Decision</text>
    
    <rect x="200" y="180" width="110" height="50" rx="8" fill="#fff" stroke="#666" stroke-width="2" />
    <text x="255" y="211" font-size="16" font-weight="600" text-anchor="middle" fill="#444">Database</text>
    
    <line x1="130" y1="95" x2="170" y2="95" stroke="#666" stroke-width="2" marker-end="url(#arrow)" />
    <line x1="300" y1="95" x2="340" y2="95" stroke="#666" stroke-width="2" marker-end="url(#arrow)" />
    <line x1="440" y1="95" x2="480" y2="95" stroke="#666" stroke-width="2" marker-end="url(#arrow)" />
    <path d="M 255 180 L 255 155 Q 255 145 265 145 L 375 145 Q 390 145 390 130 L 390 120" fill="none" stroke="#666" stroke-width="2" marker-end="url(#arrow)" />

    <circle cx="75" cy="40" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="75" y="45" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">2</text>
    
    <circle cx="150" cy="95" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="150" y="100" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">1</text>
    
    <circle cx="235" cy="40" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="235" y="45" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">3</text>
    
    <circle cx="320" cy="95" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="320" y="100" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">4</text>
    
    <circle cx="390" cy="40" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="390" y="45" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">5</text>
    
    <circle cx="320" cy="145" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="320" y="150" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">6</text>
    
    <circle cx="460" cy="95" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="460" y="100" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">7</text>
    
    <circle cx="255" cy="245" r="16" fill="#ffb3c1" stroke="#ff4d6d" stroke-width="2" />
    <text x="255" y="250" font-size="14" font-weight="bold" text-anchor="middle" fill="#590d22">8</text>
  </svg>
</div>`,
                options: [
                    { id: 'face_recognition', textEn: 'Face recognition' },
                    { id: 'feature_transformation', textEn: 'Feature transformation' },
                    { id: 'keystroke_dynamics', textEn: 'Keystroke dynamics' },
                    { id: 'behavioral_traits', textEn: 'Behavioral traits' },
                    { id: 'score_level', textEn: 'Score-level' },
                    { id: 'liveness_detection', textEn: 'Liveness detection' },
                    { id: 'sensor', textEn: 'Sensor' },
                    { id: 'hill_climbing', textEn: 'Hill-climbing' },
                    { id: 'quality_based', textEn: 'Quality-based' },
                    { id: 'cryptographic_hashing', textEn: 'Cryptographic hashing' },
                    { id: 'nir_imaging', textEn: 'NIR imaging' },
                    { id: 'mfccs', textEn: 'MFCCs' },
                    { id: 'cancelable_biometrics', textEn: 'Cancelable biometrics' },
                    { id: 'bias', textEn: 'Bias' },
                    { id: 'privacy_regulations', textEn: 'Privacy regulations' },
                    { id: 'spoofing', textEn: 'spoofing' },
                    { id: 'eigenfaces_pca', textEn: 'Eigenfaces (PCA)' },
                    { id: 'iris', textEn: 'Iris' }
                ],
                subQuestions: [
                    { id: 'sub1', textEn: '_________________ is non-intrusive but faces challenges in illumination, pose, and aging.', correctAnswer: 'face_recognition' },
                    { id: 'sub2', textEn: '_____________ applies distortion before storage.', correctAnswer: 'feature_transformation' },
                    { id: 'sub3', textEn: '______________ enable continuous authentication.', correctAnswer: 'keystroke_dynamics' },
                    { id: 'sub4', textEn: '____________ are learned, and have higher variability.', correctAnswer: 'behavioral_traits' },
                    { id: 'sub5', textEn: 'Fusion can happen at sensor, feature, score, rank, or decision levels. _____________ fusion offers the best trade-off between implementation difficulty and the amount of information to process.', correctAnswer: 'score_level' },
                    { id: 'sub6', textEn: '___________________ distinguishes real from fake biometric measurement.', correctAnswer: 'liveness_detection' },
                    { id: 'sub7', textEn: 'The attack vectors ordered by the biometric system workflow. Replay attack (stolen signal) is at which position?', correctAnswer: 'sensor' },
                    { id: 'sub8', textEn: '__________________ can reconstruct templates from scores.', correctAnswer: 'hill_climbing' },
                    { id: 'sub9', textEn: '_______________ fusion dynamically weights samples.', correctAnswer: 'quality_based' },
                    { id: 'sub10', textEn: '____________ doesn’t work due to intra-class variation.', correctAnswer: 'cryptographic_hashing' },
                    { id: 'sub11', textEn: '_____________________ reveals texture in all eye colors.', correctAnswer: 'nir_imaging' },
                    { id: 'sub12', textEn: '_____________ are primary voice features.', correctAnswer: 'mfccs' },
                    { id: 'sub13', textEn: '___________________ enables revocable templates.', correctAnswer: 'cancelable_biometrics' },
                    { id: 'sub14', textEn: '________________ must be addressed through diverse data and auditing.', correctAnswer: 'bias' },
                    { id: 'sub15', textEn: '____________________ require consent, deletion, and transparency', correctAnswer: 'privacy_regulations' },
                    { id: 'sub16', textEn: 'We use multimodal fusion (face+voice+lip movement), plus active liveness challenges, to defeat most ____________ attacks.', correctAnswer: 'spoofing' },
                    { id: 'sub17', textEn: '___________________ reduces dimension but ignores class labels (unsupervised)', correctAnswer: 'eigenfaces_pca' },
                    { id: 'sub18', textEn: '______________ is the gold standard and the most accurate biometric modality.', correctAnswer: 'iris' }
                ],
                marks: 9.0
            }
        ]
    },
    intro_law_quiz1: {
        id: 'intro_law_quiz1',
        title: 'الكويز الأول',
        titleAr: 'الكويز الأول',
        icon: '⚖️',
        color: '#795548',
        questions: [
            {
                id: 1, type: 'mcq', marks: 2.0,
                questionAr: 'من وظائف القانون',
                options: [
                    { id: 'a', textAr: 'التوفيق بين المصالح المتعارضة' },
                    { id: 'b', textAr: 'جميع ما ذكر' },
                    { id: 'c', textAr: 'دعم السلام في المجتمع' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 2, type: 'mcq', marks: 2.0,
                questionAr: 'تعتبر قواعد القانون العام',
                options: [
                    { id: 'a', textAr: 'جميعها امرة' },
                    { id: 'b', textAr: 'معظمها امرة' },
                    { id: 'c', textAr: 'قواعد مكملة' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 3, type: 'mcq', marks: 2.0,
                questionAr: 'من خصائص القاعدة القانونية',
                options: [
                    { id: 'a', textAr: 'قاعدة ملزمة غير مقترنة بجزاء' },
                    { id: 'b', textAr: 'قاعدة خاصة' },
                    { id: 'c', textAr: 'تحكم السلوك الظاهر' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 4, type: 'mcq', marks: 2.0,
                questionAr: 'التجريد يعتبر',
                options: [
                    { id: 'a', textAr: 'الاثر المترتب على القاعدة القانونية' },
                    { id: 'b', textAr: 'صفة من صفات القاعدة القانونية' },
                    { id: 'c', textAr: 'تنظيم لعلاقات المجتمع' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 5, type: 'mcq', marks: 2.0,
                questionAr: 'يعتبر قانون اصول المحاكمات المدنية',
                options: [
                    { id: 'a', textAr: 'قانون موضوعي' },
                    { id: 'b', textAr: 'قانون سلوكي' },
                    { id: 'c', textAr: 'قانون اجرائي' }
                ],
                correctAnswer: 'c'
            }
        ]
    },
    intro_law_quiz2: {
        id: 'intro_law_quiz2',
        title: 'الكويز الثاني',
        titleAr: 'الكويز الثاني',
        icon: '⚖️',
        color: '#795548',
        questions: [
            {
                id: 1, type: 'mcq', marks: 1.0,
                questionAr: 'وظيفة القانون تتمثل في',
                options: [
                    { id: 'a', textAr: 'تخصيص القاعدة القانونية' },
                    { id: 'b', textAr: 'تحقيق التعارض في المجتمع' },
                    { id: 'c', textAr: 'دعم السلام في المجتمع' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 2, type: 'mcq', marks: 1.0,
                questionAr: 'سن القواعد القانونية واخراجها مكتوبة محددة بالفاظ معينة بواسطة سلطة مختصة يطلق على',
                options: [
                    { id: 'a', textAr: 'التشريع' },
                    { id: 'b', textAr: 'الاجتهادات القضائية' },
                    { id: 'c', textAr: 'الفقه' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 3, type: 'mcq', marks: 1.0,
                questionAr: 'يقصد بالتشريع الاعلى في الدولة والذي يحدد شكل الدولة ونظام الحكم فيها والسلطات الثلاثة والحقوق والحريات',
                options: [
                    { id: 'a', textAr: 'التعليمات' },
                    { id: 'b', textAr: 'التشريع العادي' },
                    { id: 'c', textAr: 'الدستور' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 4, type: 'mcq', marks: 1.0,
                questionAr: 'اعتياد الناس على نوع من السلوك مع الاعتقاد بأنه ملزم لهم في معاملاتهم وان مخالفته تستتبع ايقاع الجزاء يقصد به',
                options: [
                    { id: 'a', textAr: 'القانون' },
                    { id: 'b', textAr: 'العادة الاتفاقية' },
                    { id: 'c', textAr: 'العرف' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 5, type: 'mcq', marks: 1.0,
                questionAr: 'واحدة من الاتية لا تعتبر من خصائص القاعدة القانونية',
                options: [
                    { id: 'a', textAr: 'عامة ومجردة' },
                    { id: 'b', textAr: 'تحكم السلوك الداخلي' },
                    { id: 'c', textAr: 'قاعدة اجتماعية' }
                ],
                correctAnswer: 'b'
            }
        ]
    },
    intro_law_quiz3: {
        id: 'intro_law_quiz3',
        title: 'الكويز الثالث',
        titleAr: 'الكويز الثالث',
        icon: '⚖️',
        color: '#795548',
        questions: [
            {
                id: 1, type: 'mcq', marks: 1.0,
                questionAr: 'يحدد موطن ناقص الاهلية في القانون المدني بناء على',
                options: [
                    { id: 'a', textAr: 'موطن من ينوب عنه قانونا' },
                    { id: 'b', textAr: 'اي موطن مختار يختاره القاضي' },
                    { id: 'c', textAr: 'موطن اقامته الاصلي' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 2, type: 'tf', marks: 1.0,
                questionAr: 'يعتبر الشخص قريبا لابن عمه من الدرجة الرابعة حيث يحذف الاصل المشترك وهو الجد',
                correctAnswer: true
            },
            {
                id: 3, type: 'mcq', marks: 1.0,
                questionAr: 'الحكم القانوني اذا ارتكب شخص فعلا بدون قصد اضر بالغير',
                options: [
                    { id: 'a', textAr: 'يحكم عليه بالحبس' },
                    { id: 'b', textAr: 'لايحكم عليه لانه بدون قصد' },
                    { id: 'c', textAr: 'يحكم بالتعويض' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 4, type: 'mcq', marks: 1.0,
                questionAr: 'التعريف الاتي : طائفة من الحقوق تهدف الى احاطة شخص الانسان بالرعاية والاحترام الواجبين له',
                options: [
                    { id: 'a', textAr: 'الحقوق العامة' },
                    { id: 'b', textAr: 'الحقوق الخاصة' },
                    { id: 'c', textAr: 'حقوق الاسرة' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 5, type: 'mcq', marks: 1.0,
                questionAr: 'اختصاص شخص بشئ مادي اختصاص مباشر يقره القانون فيقوم بأعمال معينة تحقق له منفعة تتعلق بهذا الشئ يقصد بذلك',
                options: [
                    { id: 'a', textAr: 'الحقوق الذهنية' },
                    { id: 'b', textAr: 'الحقوق العينية' },
                    { id: 'c', textAr: 'الحقوق الشخصية' }
                ],
                correctAnswer: 'b'
            }
        ]
    },
    digital_logic_design_quiz1: {
        id: 'digital_logic_design_quiz1',
        title: 'Quiz 1: Final Exam Archive',
        titleAr: 'اسئلة سنوات فاينل',
        icon: '🧮',
        color: '#4CAF50',
        forceEnglish: true,
        questions: [
            {
                id: 1, type: 'mcq', marks: 1.0,
                questionEn: 'What is the odd parity for the following data [ 0110011100 ]',
                options: [
                    { id: 'A', textEn: '0' },
                    { id: 'B', textEn: '1' },
                    { id: 'C', textEn: 'Insufficient information' },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 2, type: 'mcq', marks: 1.0,
                questionEn: 'What is the simplified expression for the K-map below?\n<br>\n<table border="1" cellpadding="5" cellspacing="0" style="text-align:center; background:white; color:black;">\n<tr><th>A \\ B</th><th>0</th><th>1</th></tr>\n<tr><th>0</th><td>1</td><td>1</td></tr>\n<tr><th>1</th><td>0</td><td>1</td></tr>\n</table>',
                options: [
                    { id: 'A', textEn: 'A + B' },
                    { id: 'B', textEn: "A'B + B'" },
                    { id: 'C', textEn: "A + B'" },
                    { id: 'D', textEn: "A' + B" }
                ],
                correctAnswer: 'D'
            },
            {
                id: 3, type: 'mcq', marks: 1.0,
                questionEn: "Simplify the maxterm expression (A + B + C)(A + B + C').",
                options: [
                    { id: 'A', textEn: 'A + B' },
                    { id: 'B', textEn: "A' + C" },
                    { id: 'C', textEn: 'B + C' },
                    { id: 'D', textEn: "A + C'" }
                ],
                correctAnswer: 'A'
            },
            {
                id: 4, type: 'mcq', marks: 1.0,
                questionEn: "The characteristic equation of D flip-flop is:",
                options: [
                    { id: 'A', textEn: 'Q = 1' },
                    { id: 'B', textEn: 'Q = 0' },
                    { id: 'C', textEn: "Q = D'" },
                    { id: 'D', textEn: 'Q = D' }
                ],
                correctAnswer: 'D'
            },
            {
                id: 5, type: 'mcq', marks: 1.0,
                questionEn: "If four 4 input multiplexers drive a 4 input multiplexer, we get a:",
                options: [
                    { id: 'A', textEn: '16 input MUX' },
                    { id: 'B', textEn: '8 input MUX' },
                    { id: 'C', textEn: '4 input MUX' },
                    { id: 'D', textEn: '2 input MUX' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 6, type: 'mcq', marks: 1.0,
                questionEn: "To build a (4 X 16) decoder from (2X4) decoders, how many decoders are needed (using a two level enable scheme)?",
                options: [
                    { id: 'A', textEn: '2' },
                    { id: 'B', textEn: '6' },
                    { id: 'C', textEn: '8' },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'D'
            },
            {
                id: 7, type: 'mcq', marks: 1.0,
                questionEn: "For the Mux shown here, let all even D inputs be LOW and all odd D inputs are HIGH, both S inputs be HIGH, and the enable input be LOW. What is the status of the Y output?\n\nInputs:\n- D0 = 0\n- D1 = 1\n- D2 = 0\n- D3 = 1\n- Select: S1, S0\n- EN = active LOW",
                options: [
                    { id: 'A', textEn: 'LOW' },
                    { id: 'B', textEn: 'HIGH' },
                    { id: 'C', textEn: "Don't Care" },
                    { id: 'D', textEn: 'Cannot be determined' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 8, type: 'mcq', marks: 1.0,
                questionEn: "*Questions 8-12 are about the same circuit.*\n\nWhen designing a 3-bit even up down counter that counts up when the external input is high and counts down when the external input is low using T flip flops. The counter mentioned is classified as:",
                options: [
                    { id: 'A', textEn: 'Mealy sequential circuit' },
                    { id: 'B', textEn: 'Moore sequential circuit' },
                    { id: 'C', textEn: 'Combinational logic circuit' },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 9, type: 'mcq', marks: 1.0,
                questionEn: "How many states are used in the above counter? (3-bit even up down counter)",
                options: [
                    { id: 'A', textEn: '2 states' },
                    { id: 'B', textEn: '4 states' },
                    { id: 'C', textEn: '8 states' },
                    { id: 'D', textEn: '6 states' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 10, type: 'mcq', marks: 1.0,
                questionEn: "The equations for the flip flops are:",
                options: [
                    { id: 'A', textEn: "TA=B XNOR X, TB=1, TC=0" },
                    { id: 'B', textEn: "TA=B XOR X, TB=1, TC=0" },
                    { id: 'C', textEn: "TA=A XNOR X, TB=B, TC=1" },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 11, type: 'mcq', marks: 1.0,
                questionEn: "Which of the following state diagrams represents the above counter?",
                options: [
                    { id: 'A', textEn: '8-state ring diagram counting sequentially' },
                    { id: 'B', textEn: '4-state diagram cycling 000 <-> 010 <-> 100 <-> 110 based on X' },
                    { id: 'C', textEn: '8-state bi-directional transition diagram' },
                    { id: 'D', textEn: '4-state diagram traversing odd states' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 12, type: 'mcq', marks: 1.0,
                questionEn: "Which of the following is the state equation for QA(t+1)?",
                options: [
                    { id: 'A', textEn: "QA(t+1) = C'B'" },
                    { id: 'B', textEn: "QA(t+1) = X'(A XOR B) + C'" },
                    { id: 'C', textEn: "QA(t+1) = X'(A XNOR B) + X(A XOR B)" },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'C'
            },
            {
                id: 13, type: 'mcq', marks: 1.0,
                questionEn: "*Consider a sequential circuit with 2 JK flip flops (A, B) driven by external input X.*\nThe clock input for both flip flops has a bubble on its triangle symbol. The circuit above is:",
                options: [
                    { id: 'A', textEn: 'Rising edge triggered' },
                    { id: 'B', textEn: 'Falling edge triggered' },
                    { id: 'C', textEn: 'High level triggered' },
                    { id: 'D', textEn: 'Low level triggered' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 14, type: 'mcq', marks: 1.0,
                questionEn: "Which flip flop in the circuit above uses the trigger state at A=1, B=0, X=0?\n\nCircuit logic derived:\nJA = X + QB\nKA = X'\nJB = X + QA'\nKB = X * QA",
                options: [
                    { id: 'A', textEn: 'A' },
                    { id: 'B', textEn: 'B' },
                    { id: 'C', textEn: 'Neither' },
                    { id: 'D', textEn: 'Both' }
                ],
                correctAnswer: 'C'
            },
            {
                id: 15, type: 'mcq', marks: 1.0,
                questionEn: "Consider the timing diagram below, where the flipflop is *rising edge triggered*. Which of the following represents the correct output?\n\n**Timing Diagram Details:**\n- **Clock (CLK):** Regular square wave (Rising edges occur at times 1, 2, 3, 4, 5...)\n- **Input (T):**\n  • Edge 1: T is LOW (0)\n  • Edge 2: T is HIGH (1)\n  • Edge 3: T is LOW (0)\n  • Edge 4: T is HIGH (1)\n  • Edge 5: T is HIGH (1)\n\n*(Note: A T-flip-flop toggles its output only when T=1 on the clock edge, otherwise it holds its state)*",
                options: [
                    { id: 'A', textEn: 'Output a (Toggles its state ONLY on Edges 2, 4, and 5)' },
                    { id: 'B', textEn: 'Output b (Toggles its state on Edges 1 and 3)' },
                    { id: 'C', textEn: 'Output c (Toggles its state on falling edges)' },
                    { id: 'D', textEn: 'Output d (Holds its state when T=1)' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 16, type: 'mcq', marks: 1.0,
                questionEn: "The master slave JK flip flop solves",
                options: [
                    { id: 'A', textEn: 'Deadlock' },
                    { id: 'B', textEn: 'Racing condition' },
                    { id: 'C', textEn: 'Multiple access' },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 17, type: 'mcq', marks: 1.0,
                questionEn: "Consider the following state table and find the DA flip flop input equation.\n<br>\n<table border=\"1\" cellpadding=\"5\" cellspacing=\"0\" style=\"text-align:center; background:white; color:black;\">\n<tr><th>P.state (AB)</th><th>X</th><th>N.state (AB)</th><th>Y</th><th>DA</th><th>DB</th></tr>\n<tr><td>00</td><td>0</td><td>00</td><td>0</td><td>0</td><td>0</td></tr>\n<tr><td>00</td><td>1</td><td>01</td><td>0</td><td>0</td><td>1</td></tr>\n<tr><td>01</td><td>0</td><td>00</td><td>0</td><td>0</td><td>0</td></tr>\n<tr><td>01</td><td>1</td><td>10</td><td>0</td><td>1</td><td>0</td></tr>\n<tr><td>10</td><td>0</td><td>11</td><td>0</td><td>1</td><td>1</td></tr>\n<tr><td>10</td><td>1</td><td>10</td><td>0</td><td>1</td><td>0</td></tr>\n<tr><td>11</td><td>0</td><td>00</td><td>0</td><td>0</td><td>0</td></tr>\n<tr><td>11</td><td>1</td><td>01</td><td>1</td><td>0</td><td>1</td></tr>\n</table>",
                options: [
                    { id: 'A', textEn: 'DA = ABX' },
                    { id: 'B', textEn: "DA = AB' + A'BX" },
                    { id: 'C', textEn: "DA = A'B'X + ABX + AB'X'" },
                    { id: 'D', textEn: 'None of the above' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 18, type: 'mcq', marks: 1.0,
                questionEn: "The critical value for the test is equal to:",
                options: [
                    { id: 'A', textEn: '-1.96' },
                    { id: 'B', textEn: '1.96' },
                    { id: 'C', textEn: '-1.65' },
                    { id: 'D', textEn: '1.65' }
                ],
                correctAnswer: 'C'
            },
            {
                id: 19, type: 'mcq', marks: 1.0,
                questionEn: "The value of the test statistic is:",
                options: [
                    { id: 'A', textEn: '-3.37' },
                    { id: 'B', textEn: '3.37' },
                    { id: 'C', textEn: '-2.67' },
                    { id: 'D', textEn: '2.67' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 20, type: 'mcq', marks: 1.0,
                questionEn: "The result of the hypothesis test is:",
                options: [
                    { id: 'A', textEn: 'Do not reject H0; we conclude that the proportion of smokers less than 10%.' },
                    { id: 'B', textEn: 'Reject H0; we conclude that the proportion of smokers less than 10%.' },
                    { id: 'C', textEn: 'Do not reject H0; we conclude that the proportion of smokers not less than 10%.' },
                    { id: 'D', textEn: 'Reject H0; we conclude that the proportion of smokers not less than 10%.' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 21, type: 'mcq', marks: 1.0,
                questionEn: "*For questions 21-25:*\nThe data in the following table shows the monthly profits in thousands of JD for ten factories before and after a paid advertisement on social media:\n\n<table border=\"1\" cellpadding=\"5\" cellspacing=\"0\" style=\"text-align:center; background:white; color:black;\">\n<tr><th>Profits Before Ad</th><td>20</td><td>10</td><td>15</td><td>32</td><td>10</td><td>25</td><td>40</td><td>35</td><td>50</td><td>8</td></tr>\n<tr><th>Profits After Ad</th><td>25</td><td>14</td><td>18</td><td>37</td><td>11</td><td>24</td><td>44</td><td>35</td><td>45</td><td>12</td></tr>\n</table>\n\n*Did the advertisement cause an increase in profits? Test the hypothesis at a statistical significance level alpha = 5%.*\n\nThe alternative hypotheses will be:",
                options: [
                    { id: 'A', textEn: 'H1: μ_D ≠ 0' },
                    { id: 'B', textEn: 'H1: μ_D < 0' },
                    { id: 'C', textEn: 'H1: μ_D ≠ -5' },
                    { id: 'D', textEn: 'H1: μ_D > 0' }
                ],
                correctAnswer: 'D'
            },
            {
                id: 22, type: 'mcq', marks: 1.0,
                questionEn: "The mean of the change in profits after the advertisement (D̄) is equal to:",
                options: [
                    { id: 'A', textEn: '2.6' },
                    { id: 'B', textEn: '2' },
                    { id: 'C', textEn: '-2.6' },
                    { id: 'D', textEn: '-2' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 23, type: 'mcq', marks: 1.0,
                questionEn: "The critical value for the test is equal to:",
                options: [
                    { id: 'A', textEn: '-1.83' },
                    { id: 'B', textEn: '1.83' },
                    { id: 'C', textEn: '-1.65' },
                    { id: 'D', textEn: '1.65' }
                ],
                correctAnswer: 'B'
            },
            {
                id: 24, type: 'mcq', marks: 1.0,
                questionEn: "The value of the test statistic is:",
                options: [
                    { id: 'A', textEn: '1.96' },
                    { id: 'B', textEn: '4.55' },
                    { id: 'C', textEn: '-3.56' },
                    { id: 'D', textEn: '-1.96' }
                ],
                correctAnswer: 'A'
            },
            {
                id: 25, type: 'mcq', marks: 1.0,
                questionEn: "The result of the hypothesis test is:",
                options: [
                    { id: 'A', textEn: 'Do not reject H0; there is no increase in profits.' },
                    { id: 'B', textEn: 'Do not reject H0; there is an increase in profits.' },
                    { id: 'C', textEn: 'Reject H0; there is an increase in profits.' },
                    { id: 'D', textEn: 'Reject H0; there is no increase in profits.' }
                ],
                correctAnswer: 'C'
            }
        ]
    },
    prob_stats_mid: {
        id: 'prob_stats_mid',
        title: 'Probabilities and Statistics - Quizzes',
        titleAr: 'الاحتمالات والإحصاء - كويزات',
        icon: '📊',
        color: '#FF9800',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'If X is a random variable with standard deviation 3 and X is changed to Y = -3X - 1, then the variance of Y is:',
                options: [
                    { id: 'a', textEn: '9' },
                    { id: 'b', textEn: '27' },
                    { id: 'c', textEn: '81' },
                    { id: 'd', textEn: '-10' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'If two balls are drawn without replacement from a box containing 5 red balls and 3 white balls, then the probability that both balls are the same color is:',
                options: [
                    { id: 'a', textEn: '36/56' },
                    { id: 'b', textEn: '50/56' },
                    { id: 'c', textEn: '30/56' },
                    { id: 'd', textEn: '26/56' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: "Let A and B be two events in a random experiment such that P(A ∩ B') = 0.3, P(B ∩ A') = 0.2 and P((A ∩ B)') = 0.7, then P(B) =",
                options: [
                    { id: 'a', textEn: '0.9' },
                    { id: 'b', textEn: '0.8' },
                    { id: 'c', textEn: '0.7' },
                    { id: 'd', textEn: '0.5' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'In rolling a die twice, the probability of getting sum of the numbers equal to 7 is:',
                options: [
                    { id: 'a', textEn: '6/36' },
                    { id: 'b', textEn: '8/36' },
                    { id: 'c', textEn: '4/36' },
                    { id: 'd', textEn: '5/36' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Suppose X is a random variable with probability distribution table below, find E(X²).',
                tableData: {
                    headers: ['X', '12', '9', '4', '2', '1'],
                    rows: [
                        ['P(X=x)', '0.25', '0.15', '0.3', '0.2', '0.1']
                    ]
                },
                options: [
                    { id: 'a', textEn: '4.15' },
                    { id: 'b', textEn: '6.05' },
                    { id: 'c', textEn: '17.25' },
                    { id: 'd', textEn: '53.85' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'Based on the same probability distribution table from Question 5, find the variance of X.',
                tableData: {
                    headers: ['X', '12', '9', '4', '2', '1'],
                    rows: [
                        ['P(X=x)', '0.25', '0.15', '0.3', '0.2', '0.1']
                    ]
                },
                options: [
                    { id: 'a', textEn: '17.25' },
                    { id: 'b', textEn: '53.85' },
                    { id: 'c', textEn: '4.15' },
                    { id: 'd', textEn: '6.05' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'The number of elements in the sample space for tossing a coin 4 times is:',
                options: [
                    { id: 'a', textEn: '8' },
                    { id: 'b', textEn: '12' },
                    { id: 'c', textEn: '16' },
                    { id: 'd', textEn: '32' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'A random variable takes the values {1, 2, 3} where P(X=1) = 0.5 and E(X) = 1.6, then find P(X=3):',
                options: [
                    { id: 'a', textEn: '0.1' },
                    { id: 'b', textEn: '0.4' },
                    { id: 'c', textEn: '0.6' },
                    { id: 'd', textEn: '0.2' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            }
        ]
    },
    prob_stats_final: {
        id: 'prob_stats_final',
        title: 'Probabilities and Statistics - Final',
        titleAr: 'الاحتمالات والإحصاء - فاينل',
        icon: '📊',
        color: '#FF9800',
        forceEnglish: true,
        questions: []
    },
    df_os_quiz1: {
        id: 'df_os_quiz1',
        title: 'Quiz 1 - SRTF & Producer-Consumer',
        titleAr: 'كويز 1 - SRTF والمنتج والمستهلك',
        icon: '🖥️',
        color: '#3F51B5',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Consider SRTF scheduling with: P1(arrival=0, burst=7), P2(arrival=2, burst=3), P3(arrival=3, burst=6), P4(arrival=5, burst=4). What is the Average Waiting Time?',
                questionAr: 'باستخدام خوارزمية SRTF مع: P1(وصول=0, تنفيذ=7), P2(وصول=2, تنفيذ=3), P3(وصول=3, تنفيذ=6), P4(وصول=5, تنفيذ=4). ما هو متوسط وقت الانتظار؟',
                options: [
                    { id: 'a', textEn: '3.0 ms', textAr: '3.0 ملي ثانية' },
                    { id: 'b', textEn: '4.5 ms', textAr: '4.5 ملي ثانية' },
                    { id: 'c', textEn: '5.25 ms', textAr: '5.25 ملي ثانية' },
                    { id: 'd', textEn: '2.75 ms', textAr: '2.75 ملي ثانية' }
                ],
                correctAnswer: 'b',
                explanation: 'P1 wait = 14-0-7 = 7, P2 wait = 5-2-3 = 0, P3 wait = 20-3-6 = 11, P4 wait = 9-5-4 = 0. Average = (7+0+11+0)/4 = 4.5 ms',
                explanationAr: 'وقت انتظار P1 = 14-0-7 = 7، P2 = 5-2-3 = 0، P3 = 20-3-6 = 11، P4 = 9-5-4 = 0. المتوسط = (7+0+11+0)/4 = 4.5 ملي ثانية',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Using the same SRTF scenario (P1:0,7 | P2:2,3 | P3:3,6 | P4:5,4), which process runs during the time interval [t=5, t=9]?',
                questionAr: 'في نفس مثال SRTF (P1:0,7 | P2:2,3 | P3:3,6 | P4:5,4)، أي عملية تعمل في الفترة الزمنية [t=5, t=9]؟',
                options: [
                    { id: 'a', textEn: 'P1', textAr: 'P1' },
                    { id: 'b', textEn: 'P2', textAr: 'P2' },
                    { id: 'c', textEn: 'P3', textAr: 'P3' },
                    { id: 'd', textEn: 'P4', textAr: 'P4' }
                ],
                correctAnswer: 'd',
                explanation: 'At t=5, P2 finishes and P4 arrives with burst=4. Ready processes: P1(rem=5), P3(rem=6), P4(rem=4). P4 has the shortest remaining time, so it runs from t=5 to t=9.',
                explanationAr: 'عند t=5، تنتهي P2 وتصل P4 ببرست=4. العمليات الجاهزة: P1(متبقي=5), P3(متبقي=6), P4(متبقي=4). P4 لديها أقصر وقت متبقي فتعمل من t=5 إلى t=9.',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'In SRTF scheduling, what is the waiting time of process P3 (arrival=3, burst=6) given the order: P1(0-2), P2(2-5), P4(5-9), P1(9-14), P3(14-20)?',
                questionAr: 'في جدولة SRTF، ما هو وقت انتظار العملية P3 (وصول=3، تنفيذ=6) بالترتيب: P1(0-2)، P2(2-5)، P4(5-9)، P1(9-14)، P3(14-20)؟',
                options: [
                    { id: 'a', textEn: '5 ms', textAr: '5 ملي ثانية' },
                    { id: 'b', textEn: '7 ms', textAr: '7 ملي ثانية' },
                    { id: 'c', textEn: '9 ms', textAr: '9 ملي ثانية' },
                    { id: 'd', textEn: '11 ms', textAr: '11 ملي ثانية' }
                ],
                correctAnswer: 'd',
                explanation: 'P3 waiting time = Finish time - Arrival time - Burst time = 20 - 3 - 6 = 11 ms',
                explanationAr: 'وقت انتظار P3 = وقت الانتهاء - وقت الوصول - وقت التنفيذ = 20 - 3 - 6 = 11 ملي ثانية',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'What does SRTF stand for?',
                questionAr: 'ماذا تعني اختصار SRTF؟',
                options: [
                    { id: 'a', textEn: 'Shortest Run Time First', textAr: 'أقصر وقت تشغيل أولاً' },
                    { id: 'b', textEn: 'Scheduled Round Time First', textAr: 'وقت الجولة المجدولة أولاً' },
                    { id: 'c', textEn: 'Shortest Remaining Time First', textAr: 'أقصر وقت متبقٍّ أولاً' },
                    { id: 'd', textEn: 'Sequential Run Task First', textAr: 'المهمة التسلسلية أولاً' }
                ],
                correctAnswer: 'c',
                explanation: 'SRTF = Shortest Remaining Time First. It is the preemptive version of SJF where the running process can be preempted if a new process with a shorter remaining burst time arrives.',
                explanationAr: 'SRTF = Shortest Remaining Time First (أقصر وقت متبقٍّ أولاً). وهي النسخة الاستباقية من SJF حيث يمكن استباق العملية الجارية إذا وصلت عملية جديدة بوقت تنفيذ متبقٍّ أقصر.',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'In SRTF scheduling, when does a running process get preempted?',
                questionAr: 'في جدولة SRTF، متى يتم استباق العملية الجارية؟',
                options: [
                    { id: 'a', textEn: 'After every fixed time quantum', textAr: 'بعد كل حصة زمنية ثابتة' },
                    { id: 'b', textEn: 'When a new process arrives with a shorter remaining burst time', textAr: 'عند وصول عملية جديدة بوقت تنفيذ متبقٍّ أقصر' },
                    { id: 'c', textEn: 'When the process requests I/O', textAr: 'عندما تطلب العملية عملية إدخال/إخراج' },
                    { id: 'd', textEn: 'It is never preempted once started', textAr: 'لا يتم استباقها أبداً بعد البدء' }
                ],
                correctAnswer: 'b',
                explanation: 'SRTF is a preemptive algorithm: the currently running process is preempted whenever a newly arrived process has a shorter remaining burst time.',
                explanationAr: 'SRTF خوارزمية استباقية: يتم استباق العملية الجارية عندما تصل عملية جديدة بوقت تنفيذ متبقٍّ أقصر.',
                marks: 1.0
            },
            {
                id: 6,
                type: 'mcq',
                questionEn: 'In the Producer-Consumer problem, what condition does the producer check BEFORE adding an item to the buffer to avoid overflow?',
                questionAr: 'في مسألة المنتج والمستهلك، ما الشرط الذي يتحقق منه المنتج قبل إضافة عنصر إلى المخزن المؤقت لتفادي الفيضان؟',
                options: [
                    { id: 'a', textEn: 'counter == 0', textAr: 'counter == 0' },
                    { id: 'b', textEn: 'in == out', textAr: 'in == out' },
                    { id: 'c', textEn: 'counter == BUFFER_SIZE', textAr: 'counter == BUFFER_SIZE' },
                    { id: 'd', textEn: 'out == BUFFER_SIZE - 1', textAr: 'out == BUFFER_SIZE - 1' }
                ],
                correctAnswer: 'c',
                explanation: 'The producer must check that counter != BUFFER_SIZE (i.e., buffer is not full) before producing. If counter == BUFFER_SIZE the producer waits (busy-waits or blocks).',
                explanationAr: 'يجب على المنتج التحقق من أن counter != BUFFER_SIZE (أي المخزن ليس ممتلئاً) قبل الإنتاج. إذا كان counter == BUFFER_SIZE ينتظر المنتج.',
                marks: 1.0
            },
            {
                id: 7,
                type: 'mcq',
                questionEn: 'What is the purpose of the statement `in = (in + 1) % BUFFER_SIZE` in the producer code?',
                questionAr: 'ما الغرض من العبارة `in = (in + 1) % BUFFER_SIZE` في كود المنتج؟',
                options: [
                    { id: 'a', textEn: 'Resets the buffer index to 0 every time', textAr: 'يُعيد مؤشر المخزن إلى 0 في كل مرة' },
                    { id: 'b', textEn: 'Calculates the total number of items in the buffer', textAr: 'يحسب إجمالي العناصر في المخزن' },
                    { id: 'c', textEn: 'Moves to the next slot in a circular (ring) buffer fashion', textAr: 'يتقدم إلى الفتحة التالية بطريقة المخزن الدائري' },
                    { id: 'd', textEn: 'Signals the consumer to start consuming immediately', textAr: 'يُشير للمستهلك كي يبدأ الاستهلاك فوراً' }
                ],
                correctAnswer: 'c',
                explanation: 'Using modulo BUFFER_SIZE makes the index wrap around from the last slot back to 0, implementing a circular (ring) buffer.',
                explanationAr: 'استخدام باقي القسمة على BUFFER_SIZE يجعل المؤشر يعود من الفتحة الأخيرة إلى الصفر، مما يُنفّذ المخزن الدائري.',
                marks: 1.0
            },
            {
                id: 8,
                type: 'mcq',
                questionEn: 'In the classic Producer-Consumer problem, what happens when the consumer tries to consume from an EMPTY buffer?',
                questionAr: 'في مسألة المنتج والمستهلك الكلاسيكية، ماذا يحدث عندما يحاول المستهلك الاستهلاك من مخزن فارغ؟',
                options: [
                    { id: 'a', textEn: 'It overwrites the oldest item in the buffer', textAr: 'يستبدل العنصر الأقدم في المخزن' },
                    { id: 'b', textEn: 'It causes an immediate system crash', textAr: 'يتسبب في انهيار النظام فوراً' },
                    { id: 'c', textEn: 'It waits (busy-waits or blocks) until the producer adds an item', textAr: 'ينتظر (دوار أو محجوب) حتى يضيف المنتج عنصراً' },
                    { id: 'd', textEn: 'It produces its own item to consume', textAr: 'ينتج عنصره الخاص ليستهلكه' }
                ],
                correctAnswer: 'c',
                explanation: 'When counter == 0 (buffer empty), the consumer must wait. In busy-wait solutions it loops; in semaphore-based solutions it blocks until the producer signals.',
                explanationAr: 'عندما يكون counter == 0 (المخزن فارغ)، يجب على المستهلك الانتظار. في حلول الانتظار الدوار يستمر في الحلقة؛ في الحلول المبنية على الإشارات يُحجب حتى يُشير المنتج.',
                marks: 1.0
            },
            {
                id: 9,
                type: 'mcq',
                questionEn: 'Which of the following BEST describes a preemptive CPU scheduling algorithm?',
                questionAr: 'أيٌّ مما يلي يصف بشكل أفضل خوارزمية جدولة المعالج الاستباقية؟',
                options: [
                    { id: 'a', textEn: 'A process runs until it voluntarily releases the CPU', textAr: 'تعمل العملية حتى تتخلى عن المعالج طوعاً' },
                    { id: 'b', textEn: 'The CPU can be taken away from a running process before it finishes', textAr: 'يمكن انتزاع المعالج من العملية الجارية قبل اكتمالها' },
                    { id: 'c', textEn: 'All processes receive equal CPU time regardless of burst', textAr: 'تحصل جميع العمليات على وقت معالج متساوٍ بغض النظر عن وقت التنفيذ' },
                    { id: 'd', textEn: 'Processes are sorted only once at the start and never reordered', textAr: 'تُرتَّب العمليات مرة واحدة فقط في البداية ولا تُعاد رتبتها' }
                ],
                correctAnswer: 'b',
                explanation: 'In preemptive scheduling the OS can forcibly remove the CPU from a running process (e.g., when a higher-priority or shorter-remaining-time process arrives). SRTF is a preemptive algorithm.',
                explanationAr: 'في الجدولة الاستباقية يمكن لنظام التشغيل انتزاع المعالج قسراً من العملية الجارية (مثلاً عند وصول عملية ذات أولوية أعلى أو وقت متبقٍّ أقصر). SRTF خوارزمية استباقية.',
                marks: 1.0
            },
            {
                id: 10,
                type: 'mcq',
                questionEn: 'In the SRTF example (P1:0,7 | P2:2,3 | P3:3,6 | P4:5,4), what is the FINISH (completion) time of process P1?',
                questionAr: 'في مثال SRTF (P1:0,7 | P2:2,3 | P3:3,6 | P4:5,4)، ما هو وقت الانتهاء للعملية P1؟',
                options: [
                    { id: 'a', textEn: '9', textAr: '9' },
                    { id: 'b', textEn: '11', textAr: '11' },
                    { id: 'c', textEn: '14', textAr: '14' },
                    { id: 'd', textEn: '7', textAr: '7' }
                ],
                correctAnswer: 'c',
                explanation: 'P1 runs from t=0 to t=2 (2 units), is preempted by P2 and P4, then resumes at t=9 running from t=9 to t=14 (5 units). Total burst = 7. Finish time = 14.',
                explanationAr: 'P1 تعمل من t=0 إلى t=2 (وحدتان)، يتم استباقها بواسطة P2 ثم P4، ثم تستأنف من t=9 إلى t=14 (5 وحدات). إجمالي التنفيذ = 7. وقت الانتهاء = 14.',
                marks: 1.0
            }
        ]
    },
    information_retrieval_quiz2: {
        id: 'information_retrieval_quiz2',
        title: 'Quiz 2',
        titleAr: 'كويز 2',
        icon: '🔍',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Why can separately expanding the query "tropical fish" by expanding "tropical" and "fish" independently make retrieval worse?',
                options: [
                    { id: 'a', textEn: '"Tropical" may add climate or vacation terms, while "fish" may add food or fishing terms, so whole-query evidence is safer' },
                    { id: 'b', textEn: 'Query expansion should never use snippets, top documents, or query logs' },
                    { id: 'c', textEn: 'Separate expansion always improves recall and precision equally' },
                    { id: 'd', textEn: '"Tropical fish" should be reduced to only the word "fish" because it is shorter' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'A user types the query "java" after recently reading pages about Indonesian tourism. Which response best follows the idea that a query is an imperfect representation of an information need?',
                options: [
                    { id: 'a', textEn: 'Remove the word "java" because it is too ambiguous to search' },
                    { id: 'b', textEn: 'Treat "java" as only a programming-language query because that is the most common technical meaning' },
                    { id: 'c', textEn: 'Automatically expand the query with every word that has the same stem as "java"' },
                    { id: 'd', textEn: 'Use context cautiously and offer or boost possible intents such as Java travel, Java programming, and coffee' }
                ],
                correctAnswer: 'd',
                marks: 1.0
            },
            {
                id: 3,
                type: 'mcq',
                questionEn: 'Two users search "tank". User A has recently browsed aquarium pages, while User B has recently browsed military-history pages. A mobile user in Hyannis searches "underworld 3". Which statement best describes good use of context and local search?',
                options: [
                    { id: 'a', textEn: 'The engine should use location only when the user explicitly types coordinates' },
                    { id: 'b', textEn: 'The engine may cautiously boost aquarium or military meanings for "tank", and may boost local movie or Cape Cod results for the Hyannis search' },
                    { id: 'c', textEn: 'The engine should permanently replace the query text with the user\'s profile' },
                    { id: 'd', textEn: 'The engine should ignore all context because the query words are always enough' }
                ],
                correctAnswer: 'b',
                marks: 1.0
            },
            {
                id: 4,
                type: 'mcq',
                questionEn: 'Use Chi_rank=(n_ab-(n_a*n_b/N))^2/(n_a*n_b). Let N=2000 and n_a=100. Candidate b1 has n_b=80 and n_ab=20; b2 has n_b=50 and n_ab=15; b3 has n_b=5 and n_ab=3; b4 has n_b=300 and n_ab=15. Which candidate has the highest Chi_rank?',
                options: [
                    { id: 'a', textEn: 'b4' },
                    { id: 'b', textEn: 'b3' },
                    { id: 'c', textEn: 'b1' },
                    { id: 'd', textEn: 'b2' }
                ],
                correctAnswer: 'c',
                marks: 1.0
            },
            {
                id: 5,
                type: 'mcq',
                questionEn: 'Using Dice coefficient, two terms have counts n_a = 90, n_b = 70, and n_ab = 32. Which value is closest to their Dice coefficient?',
                options: [
                    { id: 'a', textEn: '0.40' },
                    { id: 'b', textEn: '0.20' },
                    { id: 'c', textEn: '0.71' },
                    { id: 'd', textEn: '0.32' }
                ],
                correctAnswer: 'a',
                marks: 1.0
            }
        ]
    },
    df_os_quiz2: {
        id: 'df_os_quiz2',
        title: 'Quiz 2',
        titleAr: 'كويز 2',
        icon: '🖥️',
        color: '#3F51B5',
        forceEnglish: true,
        questions: [
            {
                id: 1,
                type: 'mcq',
                questionEn: 'Consider the following processes with their arrival times and burst times using Shortest Remaining Time First (SRTF) scheduling: \n\nProcess | Arrival Time | Burst Time\n---|---|---\nP1 | 0 | 7\nP2 | 2 | 3\nP3 | 3 | 6\nP4 | 5 | 4\n\nCalculate the Average Waiting Time.',
                options: [
                    { id: 'a', textEn: '3.0' },
                    { id: 'b', textEn: '4.5' },
                    { id: 'c', textEn: '5.25' },
                    { id: 'd', textEn: '2.75' }
                ],
                correctAnswer: 'b',
                explanation: 'Gantt Chart (SRTF Scheduling):\nt = 0 → 2: P1 runs\nt = 2 → 5: P2 runs\nt = 5 → 9: P4 runs\nt = 9 → 14: P1 resumes\nt = 14 → 20: P3 runs\n\nWaiting Time = Completion Time − Arrival Time − Burst Time\nP1: 14 − 0 − 7 = 7\nP2: 5 − 2 − 3 = 0\nP3: 20 − 3 − 6 = 11\nP4: 9 − 5 − 4 = 0\nAverage = (7+0+11+0) / 4 = 4.5',
                marks: 1.0
            },
            {
                id: 2,
                type: 'mcq',
                questionEn: 'Write the pseudocode for the Producer process in the Producer–Consumer problem using a bounded buffer.',
                options: [
                    { id: 'a', textEn: 'while (true) {\n  /* produce an item in next produced */\n  while (counter == BUFFER_SIZE) ;\n  /* do nothing */\n  buffer[in] = next_produced;\n  in = (in + 1) % BUFFER_SIZE;\n  counter = counter + 1;\n}' },
                    { id: 'b', textEn: 'while (true) {\n  /* produce an item in next produced */\n  while (counter == 0) ;\n  /* do nothing */\n  buffer[out] = next_produced;\n  out = (out + 1) % BUFFER_SIZE;\n  counter = counter - 1;\n}' },
                    { id: 'c', textEn: 'while (true) {\n  /* produce an item in next produced */\n  while (counter == BUFFER_SIZE) ;\n  /* do nothing */\n  buffer[out] = next_produced;\n  in = (in + 1) % BUFFER_SIZE;\n  counter = counter - 1;\n}' },
                    { id: 'd', textEn: 'while (true) {\n  /* produce an item in next produced */\n  while (counter == 0) ;\n  /* do nothing */\n  buffer[in] = next_produced;\n  out = (out + 1) % BUFFER_SIZE;\n  counter = counter + 1;\n}' }
                ],
                correctAnswer: 'a',
                explanation: 'The producer checks if the buffer is full (counter == BUFFER_SIZE). If not, it adds the item at the `in` index, increments `in` circularly, and increments the `counter`.',
                marks: 1.0
            }
        ]
    },
    biometrics_security_midterm_expected: {
        id: 'biometrics_security_midterm_expected',
        title: 'Expected Midterm Questions',
        titleAr: 'اسئلة ميد توقعية',
        icon: '👁️',
        color: '#9C27B0',
        forceEnglish: true,
        questions: [
            {
                id: 1, type: 'mcq', marks: 1.0,
                questionEn: 'A biometric system that requires the user to present an ID card and provide a fingerprint is an example of:',
                options: [
                    { id: 'a', textEn: 'Something you know + Something you are' },
                    { id: 'b', textEn: 'Something you have + Something you are' },
                    { id: 'c', textEn: 'Something you know + Something you have' },
                    { id: 'd', textEn: 'Two-factor knowledge-based authentication' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 2, type: 'mcq', marks: 1.0,
                questionEn: 'A border control system that captures a traveler’s face and compares it against a watchlist of 5,000 known persons is operating in:',
                options: [
                    { id: 'a', textEn: 'Verification mode (1:1)' },
                    { id: 'b', textEn: 'Identification mode (1:N)' },
                    { id: 'c', textEn: 'Enrollment mode' },
                    { id: 'd', textEn: 'Continuous authentication mode' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 3, type: 'mcq', marks: 1.0,
                questionEn: 'A fingerprint system for office access has FAR = 0.05% at current threshold, 200 employees (genuine users), 50 impostor attempts per day. How many false accepts occur daily?',
                options: [
                    { id: 'a', textEn: '0.025' },
                    { id: 'b', textEn: '0.1' },
                    { id: 'c', textEn: '0.25' },
                    { id: 'd', textEn: '2.5' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 4, type: 'mcq', marks: 1.0,
                questionEn: 'Which fingerprint sensor technology measures electrical charge differences between the sensor plate and the finger’s skin?',
                options: [
                    { id: 'a', textEn: 'Optical FTIR' },
                    { id: 'b', textEn: 'Capacitive' },
                    { id: 'c', textEn: 'Ultrasonic' },
                    { id: 'd', textEn: 'Thermal' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 5, type: 'mcq', marks: 1.0,
                questionEn: 'In iris recognition, the phase information from Gabor wavelets is used instead of magnitude because:',
                options: [
                    { id: 'a', textEn: 'Phase is faster to compute' },
                    { id: 'b', textEn: 'Phase is robust to illumination changes' },
                    { id: 'c', textEn: 'Magnitude requires more storage' },
                    { id: 'd', textEn: 'Magnitude is zero for most irides' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 6, type: 'mcq', marks: 1.0,
                questionEn: '”In biometric systems, a perfect match between a query and template is common and expected.”',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 7, type: 'mcq', marks: 1.0,
                questionEn: '”Fingerprint patterns can change significantly after superficial cuts or burns, requiring re-enrollment.”',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 8, type: 'mcq', marks: 1.0,
                questionEn: '”DET curves plot FRR against FAR using linear scales for both axes.”',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 9, type: 'mcq', marks: 1.0,
                questionEn: '”Ultrasonic fingerprint sensors are harder to spoof than optical sensors because they measure subdermal layers.”',
                options: [
                    { id: 'a', textEn: 'True' },
                    { id: 'b', textEn: 'False' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 10, type: 'mcq', marks: 1.0,
                questionEn: 'Based on the ROC curves (Alpha is better at low FAR, Beta at high FAR), choose the correct statement.',
                image: q10Roc,
                tableData: {
                    headers: ['FAR', 'Alpha GAR', 'Beta GAR', 'Higher'],
                    rows: [
                        ['0%', '98%', '97%', 'Alpha'],
                        ['0.1%', '96%', '95%', 'Alpha'],
                        ['0.5%', '92%', '93%', 'Beta'],
                        ['1%', '88%', '90%', 'Beta'],
                        ['2%', '85%', '87%', 'Beta']
                    ]
                },
                options: [
                    { id: 'a', textEn: 'System Alpha performs better at all FAR levels' },
                    { id: 'b', textEn: 'System Beta performs better at all FAR levels' },
                    { id: 'c', textEn: 'System Alpha is better at low FAR, Beta at high FAR' },
                    { id: 'd', textEn: 'Neither system is clearly better overall' }
                ],
                correctAnswer: 'd'
            },
            {
                id: 11, type: 'mcq', marks: 1.0,
                questionEn: 'Based on ROC curves of Iris, Fingerprint, and Face where Iris has the highest GAR at all FARs, which statement is correct?',
                image: q11Roc,
                tableData: {
                    headers: ['FAR', 'Iris GAR', 'Fingerprint GAR', 'Face GAR', 'Best'],
                    rows: [
                        ['0.05%', '99.9%', '98.5%', '96.0%', 'Iris'],
                        ['0.1%', '99.8%', '98.0%', '95.0%', 'Iris'],
                        ['0.5%', '99.5%', '97.0%', '92.0%', 'Iris'],
                        ['1.0%', '99.0%', '95.5%', '88.0%', 'Iris'],
                        ['2.0%', '98.0%', '93.0%', '82.0%', 'Iris']
                    ]
                },
                options: [
                    { id: 'a', textEn: 'Face recognition outperforms fingerprint at all FAR levels' },
                    { id: 'b', textEn: 'Iris has the highest GAR at all FAR levels' },
                    { id: 'c', textEn: 'Fingerprint is better than iris at FAR = 0.5%' },
                    { id: 'd', textEn: 'All three systems perform equally well' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 12, type: 'mcq', marks: 1.0,
                questionEn: 'A verification system has FMR = 0.002% (1 in 50,000). The system is being considered for identification against a national database of 2,000,000 persons. What is the expected outcome if deployed for identification?',
                options: [
                    { id: 'a', textEn: 'No false matches because FMR is very low' },
                    { id: 'b', textEn: 'Approximately 40 false matches per query on average' },
                    { id: 'c', textEn: 'Approximately 0.04 false matches per query' },
                    { id: 'd', textEn: 'Cannot be determined from the information given' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 13, type: 'mcq', marks: 1.0,
                questionEn: 'Comparing DET curves for two systems (System P has lower FRR at low FAR levels):',
                image: q13Det,
                options: [
                    { id: 'a', textEn: 'System P is better for high-security applications' },
                    { id: 'b', textEn: 'System Q is better for high-security applications' },
                    { id: 'c', textEn: 'Both systems perform identically' },
                    { id: 'd', textEn: 'Neither is suitable for high security' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 14, type: 'mcq', marks: 1.0,
                questionEn: 'A university fingerprint access system reports that 75% of false rejects come from 12% of users, and 80% of false accepts target 10% of users. Which categories from Doddington’s Zoo are likely causing these patterns?',
                options: [
                    { id: 'a', textEn: 'False rejects = Lambs, False accepts = Goats' },
                    { id: 'b', textEn: 'False rejects = Goats, False accepts = Lambs' },
                    { id: 'c', textEn: 'Both caused by Wolves' },
                    { id: 'd', textEn: 'Both caused by Sheep' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 15, type: 'mcq', marks: 1.0,
                questionEn: 'A company stores employee iris templates. A data breach exposes 10,000 templates. The system uses cancelable biometrics with user-specific keys. What is the appropriate response?',
                options: [
                    { id: 'a', textEn: 'Employees must undergo new iris enrollment' },
                    { id: 'b', textEn: 'Issue new keys to affected employees' },
                    { id: 'c', textEn: 'System cannot be recovered; replace with passwords' },
                    { id: 'd', textEn: 'No action needed; cancelable biometrics cannot be compromised' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 16, type: 'mcq', marks: 1.0,
                questionEn: 'A crime scene investigator collects a partial latent fingerprint with only 8 visible minutiae points. The print is smudged and on a textured surface. Which feature level is most critical for matching this print?',
                options: [
                    { id: 'a', textEn: 'Level 1 (pattern type only)' },
                    { id: 'b', textEn: 'Level 2 (minutiae only)' },
                    { id: 'c', textEn: 'Level 3 (pores and ridge contours)' },
                    { id: 'd', textEn: 'Multi-modal fusion with face' }
                ],
                correctAnswer: 'c'
            }
        ]
    },
    ml_lab_quiz1: {
        id: 'ml_lab_quiz1',
        title: 'Machine Learning Lab - Quiz 1',
        titleAr: 'مختبر تعلم الآلة - كويز 1',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        questions: [
            { id: 1, type: 'mcq', questionEn: 'In SVM, support vectors are the data points farthest from the hyperplane.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'b', marks: 1.0 },
            { id: 2, type: 'mcq', questionEn: 'Encoding categorical data allows machine learning algorithms to use non-numeric attributes.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'a', marks: 1.0 },
            { id: 3, type: 'mcq', questionEn: 'Filling missing values with the mean is always the best approach, regardless of the dataset type.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'b', marks: 1.0 },
            { id: 4, type: 'mcq', questionEn: 'Duplicates can sometimes represent valid repeated measurements in time-series data.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'a', marks: 1.0 },
            { id: 5, type: 'mcq', questionEn: 'Accuracy is always the best metric for evaluating classification models.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'b', marks: 1.0 },
            { id: 6, type: 'mcq', questionEn: 'In SVM, a larger margin usually leads to better generalization.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'a', marks: 1.0 },
            { id: 7, type: 'mcq', questionEn: 'The Kernel Trick in SVM explicitly computes the transformation into higher dimensions.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'b', marks: 1.0 },
            { id: 8, type: 'mcq', questionEn: 'Which margin is considered better in SVM?', options: [{id: 'a', textEn: 'Smaller margin'}, {id: 'b', textEn: 'Larger margin'}, {id: 'c', textEn: 'Negative margin'}, {id: 'd', textEn: 'Equal margin'}], correctAnswer: 'b', marks: 1.0 },
            { id: 9, type: 'mcq', questionEn: 'Data cleaning is only required when handling small datasets.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'b', marks: 1.0 },
            { id: 10, type: 'mcq', questionEn: 'Outliers can sometimes represent valid, significant variations in data.', options: [{id: 'a', textEn: 'True'}, {id: 'b', textEn: 'False'}], correctAnswer: 'a', marks: 1.0 }
        ]
    }
};

export const quizCategories = [
    {
        id: 'oop',
        name: 'Object Oriented Programming',
        nameAr: 'برمجة موجهة للكائنات',
        icon: '💻',
        color: '#2196F3',
        isNew: true,
        parts: [
            { id: 'oop_midterm', title: 'Midterm Past Papers', titleAr: 'أسئلة سنوات ميد' },
            { id: 'oop_final', title: 'Final Past Papers', titleAr: 'أسئلة سنوات فاينل' },
            { id: 'oop_quizzes', title: 'Quizzes', titleAr: 'كويزات' }
        ]
    },
    { id: 'comp_skills', name: 'Computer Skills', nameAr: 'مهارات حاسوب والتعلم الالكتروني', icon: '💻', color: '#00BCD4' },
    {
        id: 'digital_society',
        name: 'Digital Society',
        nameAr: 'مجتمع رقمي',
        icon: '🌐',
        color: '#9C27B0',
        parts: [
            { id: 'digital_society_1', title: 'Part 1', titleAr: 'الجزء الأول' },
            { id: 'digital_society_2', title: 'Part 2', titleAr: 'الجزء الثاني' },
            { id: 'digital_society_3', title: 'Part 3', titleAr: 'الجزء الثالث' }
        ]
    },
    {
        id: 'vr_business',
        name: 'Business Principles for VR',
        nameAr: 'مبادئ الأعمال للواقع الافتراضي',
        icon: '💼',
        color: '#607D8B',
        parts: [
            { id: 'vr_biz_1', title: 'Part 1', titleAr: 'الجزء الأول' },
            { id: 'vr_biz_2', title: 'Part 2', titleAr: 'الجزء الثاني' },
            { id: 'vr_biz_3', title: 'Part 3', titleAr: 'الجزء الثالث' }
        ]
    },
    { id: 'psych_basics', name: 'Principles of Psychology', nameAr: 'مبادئ علم النفس', icon: '🧠', color: '#E91E63' },
    { id: 'applied_english_102', name: 'Applied English 102', nameAr: 'اللغة الإنجليزية التطبيقية 102', icon: '🇬🇧', color: '#3F51B5' },
    {
        id: 'comp_networks_1',
        name: 'Computer Networks 1',
        nameAr: 'شبكات الحاسوب ١',
        icon: '🌐',
        color: '#2196F3',
        parts: [
            { id: 'comp_networks_1_p1', title: 'Part 1', titleAr: 'الجزء الأول' },
            { id: 'comp_networks_1_p2', title: 'Part 2', titleAr: 'الجزء الثاني' }
        ]
    },
    {
        id: 'operating_systems',
        name: 'Operating Systems',
        nameAr: 'نظم تشغيل للهندسة',
        icon: '⚙️',
        color: '#FF5722',
        isNew: true,
        parts: [
            { id: 'os_mid', title: 'Mid Exam', titleAr: 'مادة الميد' },
            { id: 'os_final', title: 'Final Exam', titleAr: 'مادة الفاينل' }
        ]
    },
    {
        id: 'islam_and_life',
        name: 'Islam and Life',
        nameAr: 'الإسلام والحياة',
        icon: '🕌',
        color: '#4CAF50',
        isNew: true,
        parts: [
            { id: 'islam_and_life_p1', title: 'Part 1', titleAr: 'الجزء الأول' },
            { id: 'islam_and_life_p2', title: 'Part 2', titleAr: 'الجزء الثاني' }
        ]
    },
    {
        id: 'calculus_1',
        name: 'Calculus 1',
        nameAr: 'تفاضل وتكامل 1',
        icon: '📐',
        color: '#FF9800',
        isNew: true,
        parts: [
            { id: 'calculus_quiz1', title: 'Quiz 1 - Functions', titleAr: 'الكويز الأول - الاقترانات' },
            { id: 'calculus_quiz2', title: 'Quiz 2', titleAr: 'الكويز الثاني' }
        ]
    },
    {
        id: 'info_security',
        name: 'Information Security Principles',
        nameAr: 'مبادئ أمن المعلومات',
        icon: '🔒',
        color: '#F44336',
        isNew: true,
        parts: [
            { id: 'info_sec_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'entrepreneurship',
        name: 'Entrepreneurship & Innovation',
        nameAr: 'الريادة والابتكار (باللغة الإنجليزية)',
        icon: '🚀',
        color: '#FFC107',
        forceEnglish: true,
        isNew: true,
        parts: [
            { id: 'entrepreneurship_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' },
            { id: 'entrepreneurship_quiz2', title: 'Quiz 2', titleAr: 'الكويز الثاني' },
            { id: 'entrepreneurship_quiz3', title: 'Quiz 3', titleAr: 'الكويز الثالث' },
            { id: 'entrepreneurship_quiz4', title: 'Quiz 4', titleAr: 'الكويز الرابع' },
            { id: 'entrepreneurship_quiz5', title: 'Quiz 5', titleAr: 'الكويز الخامس' },
            { id: 'entrepreneurship_quiz6', title: 'Quiz 6', titleAr: 'الكويز السادس' },
            { id: 'entrepreneurship_quiz7', title: 'Quiz 7', titleAr: 'الكويز السابع' },
            { id: 'entrepreneurship_quiz8', title: 'Quiz 8', titleAr: 'الكويز الثامن' },
            { id: 'entrepreneurship_quiz9', title: 'Quiz 9', titleAr: 'الكويز التاسع' }
        ]
    },
    {
        id: 'numerical_analysis',
        name: 'Numerical Analysis Principles',
        nameAr: 'مبادئ التحليل العددي',
        icon: '📊',
        color: '#673AB7',
        isNew: true,
        parts: [
            { id: 'num_analysis_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'ai_programming',
        name: 'AI Programming',
        nameAr: 'برمجة الذكاء الاصطناعي',
        icon: '🤖',
        color: '#009688',
        isNew: true,
        parts: [
            { id: 'ai_programming_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'machine_learning',
        name: 'Machine Learning',
        nameAr: 'تعلم الآلة',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        isNew: true,
        parts: [
            { id: 'ml_midterm', title: 'Midterm Past Papers', titleAr: 'أسئلة سنوات ميد' },
            { id: 'ml_final', title: 'Final Past Papers', titleAr: 'أسئلة سنوات فاينل' },
            { id: 'ml_quizzes', title: 'Quizzes', titleAr: 'كويزات' }
        ]
    },
    {
        id: 'cyber_iot',
        name: 'IoT and its Security',
        nameAr: 'انترنت الأشياء وأمنها',
        icon: '🌐',
        color: '#607D8B',
        forceEnglish: true,
        isNew: true,
        parts: [
            { id: 'cyber_iot_quiz', title: 'IoT Security Quiz', titleAr: 'كويز أمن إنترنت الأشياء' }
        ]
    },
    {
        id: 'ml_lab',
        name: 'Machine Learning Lab',
        nameAr: 'مختبر تعلم الآلة',
        icon: '🤖',
        color: '#E91E63',
        forceEnglish: true,
        isNew: true,
        parts: [
            { id: 'ml_lab_quiz1', title: 'Quiz 1', titleAr: 'كويز 1' }
        ]
    },
    {
        id: 'biometrics_security',
        name: 'Biometrics and Security',
        nameAr: 'أمن وقياسات بيولوجية',
        icon: '👁️',
        color: '#9C27B0',
        isNew: true,
        parts: [
            { id: 'biometrics_security_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' },
            { id: 'biometrics_security_quiz2', title: 'Quiz 2', titleAr: 'الكويز الثاني' },
            { id: 'biometrics_security_quiz3', title: 'Quiz 3', titleAr: 'الكويز الثالث' },
            { id: 'biometrics_security_quiz4', title: 'Quiz 4', titleAr: 'الكويز الرابع' },
            { id: 'biometrics_security_midterm_expected', title: 'Expected Midterm', titleAr: 'اسئلة ميد توقعية' }
        ]
    },
    {
        id: 'intro_law',
        name: 'Introduction to Law',
        nameAr: 'مدخل الى علم القانون',
        icon: '⚖️',
        color: '#795548',
        isNew: true,
        parts: [
            { id: 'intro_law_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' },
            { id: 'intro_law_quiz2', title: 'Quiz 2', titleAr: 'الكويز الثاني' },
            { id: 'intro_law_quiz3', title: 'Quiz 3', titleAr: 'الكويز الثالث' }
        ]
    },
    {
        id: 'criminal_law_general',
        name: 'Penal Code - General Section',
        nameAr: 'قانون العقوبات القسم العام',
        icon: '📜',
        color: '#F44336',
        isNew: true,
        parts: [
            { id: 'criminal_law_general_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'digital_logic_design',
        name: 'Digital Logic Design',
        nameAr: 'تصميم منطق رقمي',
        icon: '🧮',
        color: '#4CAF50',
        parts: [
            { id: 'digital_logic_design_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'data_structures',
        name: 'Data Structures',
        nameAr: 'هياكل بيانات',
        icon: '🗂️',
        color: '#E91E63',
        isNew: true,
        parts: [
            { id: 'data_structures_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'databases',
        name: 'Database Systems',
        nameAr: 'قواعد بيانات',
        icon: '🗄️',
        color: '#3F51B5',
        isNew: true,
        parts: [
            { id: 'databases_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'comp_skills_2_science',
        name: 'Computer Skills 2 for Science Faculties',
        nameAr: 'مهارات حاسوب 2 لطلبة الكليات العلمية',
        icon: '💻',
        color: '#00BCD4',
        isNew: true,
        parts: [
            { id: 'comp_skills_2_science_quiz1', title: 'Quiz 1', titleAr: 'الكويز الأول' }
        ]
    },
    {
        id: 'military_science',
        name: 'Military Science',
        nameAr: 'علوم عسكرية',
        icon: '🎖️',
        color: '#5D4037',
        isNew: true,
        parts: [
            { id: 'military_science_mid', title: 'Mid Exam', titleAr: 'مادة الميد' },
            { id: 'military_science_final', title: 'Final Exam', titleAr: 'مادة الفاينل' }
        ]
    },
    {
        id: 'prob_stats',
        name: 'Probability and Statistics',
        nameAr: 'الاحتمالات والإحصاء',
        icon: '📊',
        color: '#FF9800',
        isNew: true,
        parts: [
            { id: 'prob_stats_mid', title: 'Quiz questions', titleAr: 'أسئلة كويزات' },
            { id: 'prob_stats_final', title: 'Final Exam', titleAr: 'مادة الفاينل' }
        ]
    },
    {
        id: 'information_retrieval',
        name: 'Information Retrieval Systems',
        nameAr: 'نظم استرجاع المعلومات',
        icon: '🔍',
        color: '#9C27B0',
        isNew: true,
        parts: [
            { id: 'information_retrieval_quiz2', title: 'Quiz 2', titleAr: 'كويز 2' }
        ]
    },
    {
        id: 'df_operating_systems',
        name: 'Operating Systems for Digital Forensics',
        nameAr: 'نظم تشغيل للتحقيقات الجنائية',
        icon: '🖥️',
        color: '#3F51B5',
        isNew: true,
        parts: [
            { id: 'df_os_quiz1', title: 'Quiz 1', titleAr: 'كويز 1' },
            { id: 'df_os_quiz2', title: 'Quiz 2', titleAr: 'كويز 2' }
        ]
    }
];
