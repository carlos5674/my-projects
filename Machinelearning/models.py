from torch import no_grad, stack
from torch.utils.data import DataLoader
from torch.nn import Module



import torch
from torch.nn import Parameter, Linear
from torch import optim, tensor, tensordot, ones, matmul
from torch.nn.functional import cross_entropy, relu, mse_loss, softmax
from torch import movedim


class PerceptronModel(Module):
    def __init__(self, dimensions):
        """
        Initialize a new Perceptron instance.

        """
        super(PerceptronModel, self).__init__()
        
        weight_vector = ones(1, dimensions)
        self.w = Parameter(weight_vector)
        

    def get_weights(self):
        """
        Return a Parameter instance with the current weights of the perceptron.
        """
        return self.w

    def run(self, x):
        """
        Calculates the score assigned by the perceptron to a data point x.

        Inputs:
            x: a node with shape (1 x dimensions)
        Returns: a node containing a single number (the score)

        The pytorch function `tensordot` may be helpful here.
        """
        return tensordot(self.get_weights(), x)

        

    def get_prediction(self, x):
        """
        Calculates the predicted class for a single data point `x`.

        Returns: 1 or -1
        """
        if self.run(x) < 0:
            return -1
        return 1



    def train(self, dataset):
        """
        Train the perceptron until convergence.
        You can iterate through DataLoader in order to 
        retrieve all the batches you need to train on.

        Each sample in the dataloader is in the form {'x': features, 'label': label} where label
        is the item we need to predict based off of its features.
        """        
        with no_grad():
            dataloader = DataLoader(dataset, batch_size=1, shuffle=True)
            done = False
            while not done:
                count = 0
                for batch in dataloader:
                    if self.get_prediction(batch['x']) != batch['label']:
                        self.w += batch['x'] * batch['label']
                        count += 1
                if count == 0:
                    done = True





class RegressionModel(Module):
    """
    A neural network model for approximating a function that maps from real
    numbers to real numbers. The network should be sufficiently large to be able
    to approximate sin(x) on the interval [-2pi, 2pi] to reasonable precision.
    """
    def __init__(self):
        # Initialize model parameters here
        super().__init__()
        self.Linear_Layer = Linear(1, 256)
        self.out = Linear(256, 1)
        self.learning_rate = 0.002
        self.batch_size = 32



    def forward(self, x):
        """
        Runs the model for a batch of examples.

        Inputs:
            x: a node with shape (batch_size x 1)
        Returns:
            A node with shape (batch_size x 1) containing predicted y-values
        """
        return self.out(relu(self.Linear_Layer(x)))

    
    def get_loss(self, x, y):
        """
        Computes the loss for a batch of examples.

        Inputs:
            x: a node with shape (batch_size x 1)
            y: a node with shape (batch_size x 1), containing the true y-values
                to be used for training
        Returns: a tensor of size 1 containing the loss
        """
        return mse_loss(self.forward(x), y)
 
        

    def train(self, dataset):
        """
        Trains the model.

        In order to create batches, create a DataLoader object and pass in `dataset` as well as your required 
        batch size. You can look at PerceptronModel as a guideline for how you should implement the DataLoader

        Each sample in the dataloader object will be in the form {'x': features, 'label': label} where label
        is the item we need to predict based off of its features.

        Inputs:
            dataset: a PyTorch dataset object containing data to be trained on
            
        """
        dataloader = DataLoader(dataset, batch_size=self.batch_size)
        optimizer = optim.Adam(self.parameters(), lr=self.learning_rate)
        done = False
        while not done:
            losses = []
            for batch in dataloader:
                optimizer.zero_grad()
                loss = self.get_loss(batch['x'], batch['label'])
                losses.append(loss)
                loss.backward()
                optimizer.step()
            if (sum(losses)/len(losses)) <= 0.02:
                done = True



            







class DigitClassificationModel(Module):
    """
    A model for handwritten digit classification using the MNIST dataset.

    Each handwritten digit is a 28x28 pixel grayscale image, which is flattened
    into a 784-dimensional vector for the purposes of this model. Each entry in
    the vector is a floating point number between 0 and 1.

    The goal is to sort each digit into one of 10 classes (number 0 through 9).

    (See RegressionModel for more information about the APIs of different
    methods here. We recommend that you implement the RegressionModel before
    working on this part of the project.)
    """
    def __init__(self):
        # Initialize model parameters here
        super().__init__()
        input_size = 28 * 28
        output_size = 10
        self.Linear_Layer1 = Linear(input_size, 512)
        self.Linear_Layer2 = Linear(512, 256)
        self.out = Linear(256, output_size)
        self.batch_size = 50
        self.learning_rate = 0.0018




    def run(self, x):
        """
        Runs the model for a batch of examples.

        Your model should predict a node with shape (batch_size x 10),
        containing scores. Higher scores correspond to greater probability of
        the image belonging to a particular class.

        Inputs:
            x: a tensor with shape (batch_size x 784)
        Output:
            A node with shape (batch_size x 10) containing predicted scores
                (also called logits)
        """
        return self.out(relu(self.Linear_Layer2(relu(self.Linear_Layer1(x)))))

 

    def get_loss(self, x, y):
        """
        Computes the loss for a batch of examples.

        The correct labels `y` are represented as a tensor with shape
        (batch_size x 10). Each row is a one-hot vector encoding the correct
        digit class (0-9).

        Inputs:
            x: a node with shape (batch_size x 784)
            y: a node with shape (batch_size x 10)
        Returns: a loss tensor
        """
        return cross_entropy(self.run(x), y)

    
        

    def train(self, dataset):
        """
        Trains the model.
        """
        dataloader = DataLoader(dataset, batch_size=self.batch_size)
        optimizer = optim.Adam(self.parameters(), lr=self.learning_rate)
        done = False
        while not done:
            for batch in dataloader:
                optimizer.zero_grad()
                loss = self.get_loss(batch['x'], batch['label'])
                loss.backward()
                optimizer.step()
            if dataset.get_validation_accuracy() > .975:
                done = True




class LanguageIDModel(Module):
    """
    A model for language identification at a single-word granularity.

    """
    def __init__(self):
        # Our dataset contains words from five different languages, and the
        # combined alphabets of the five languages contain a total of 47 unique
        # characters.
        # You can refer to self.num_chars or len(self.languages) in your code
        self.num_chars = 47
        self.languages = ["English", "Spanish", "Finnish", "Dutch", "Polish"]
        super(LanguageIDModel, self).__init__()
        "*** YOUR CODE HERE ***"
        self.hidden_size = 256
        self.batch_size = 16
        self.learning_rate = 0.0022
        self.Linear_Layer_Initial = Linear(self.num_chars, self.hidden_size)
        self.Linear_Layer1 = Linear(self.hidden_size, self.hidden_size)
        self.Linear_Layer2 = Linear(self.hidden_size, 5)


    def run(self, xs):
        """
        Runs the model for a batch of examples.

        Inputs:
            xs: a list with L elements (one per character), where each element
                is a node with shape (batch_size x self.num_chars)
        Returns:
            A node with shape (batch_size x 5) containing predicted scores
                (also called logits)
        """
        z0 = None
        for x in xs:
            if z0 == None:
                z0 = self.Linear_Layer_Initial(x)
            else:
                z0 = self.Linear_Layer_Initial(x) + self.Linear_Layer1(relu(z0))
        return self.Linear_Layer2(relu(z0))




    
    def get_loss(self, xs, y):
        """
        Computes the loss for a batch of examples.

        Inputs:
            xs: a list with L elements (one per character), where each element
                is a node with shape (batch_size x self.num_chars)
            y: a node with shape (batch_size x 5)
        Returns: a loss node
        """
        return cross_entropy(self.run(xs), y)
        

    def train(self, dataset):
        """
        Trains the model.

        """
        dataloader = DataLoader(dataset, batch_size=self.batch_size)
        optimizer = optim.Adam(self.parameters(), lr=self.learning_rate)
        done = False
        while not done:
            for batch in dataloader:
                moved_batch = movedim(batch['x'], 1, 0)
                optimizer.zero_grad()
                loss = self.get_loss(moved_batch, batch['label'])
                loss.backward()
                optimizer.step()
            if dataset.get_validation_accuracy() > .81:
                done = True

        

def Convolve(input: tensor, weight: tensor):
    """
    Acts as a convolution layer by applying a 2d convolution with the given inputs and weights.
    
    """
    input_tensor_dimensions = input.shape
    weight_dimensions = weight.shape
    Output_Tensor = tensor(())
    right_shifts = input_tensor_dimensions[1] - weight_dimensions[1] + 1
    down_shifts = input_tensor_dimensions[0] - weight_dimensions[0] + 1
    Output_Tensor = Output_Tensor.new_zeros((down_shifts, right_shifts))
    for y in range(down_shifts):
        for x in range(right_shifts):
            temp = input[y: (y+weight_dimensions[0]), x: (x+weight_dimensions[1])]
            val = tensordot(weight, temp, dims=2)
            Output_Tensor[y, x] = val
    return Output_Tensor



class DigitConvolutionalModel(Module):
    """
    A model for handwritten digit classification using the MNIST dataset.

    This class is a convolutational model which has already been trained on MNIST.
    if Convolve() has been correctly implemented, this model should be able to achieve a high accuracy
    on the mnist dataset given the pretrained weights.

    Note that this class looks different from a standard pytorch model since we don't need to train it
    as it will be run on preset weights.
    """
    

    def __init__(self):
        # Initialize your model parameters here
        super().__init__()
        output_size = 10

        self.convolution_weights = Parameter(ones((3, 3)))
        self.Linear_Layer1 = Linear(676, 256)
        self.out = Linear(256, output_size)
        self.batch_size = 50
        self.learning_rate = 0.0018





    def run(self, x):
        return self(x)
 
    def forward(self, x):
        """
        The convolutional layer is already applied, and the output is flattened for you. You should treat x as
        a regular 1-dimentional datapoint now, similar to the previous questions.
        """
        x = x.reshape(len(x), 28, 28)
        x = stack(list(map(lambda sample: Convolve(sample, self.convolution_weights), x)))
        x = x.flatten(start_dim=1)
        return self.out(relu(self.Linear_Layer1(x)))


    def get_loss(self, x, y):
        """
        Computes the loss for a batch of examples.


        Inputs:
            x: a node with shape (batch_size x 784)
            y: a node with shape (batch_size x 10)
        Returns: a loss tensor
        """
        return cross_entropy(self.forward(x), y)

     
        

    def train(self, dataset):
        """
        Trains the model.
        """
        dataloader = DataLoader(dataset, batch_size=self.batch_size)
        optimizer = optim.Adam(self.parameters(), lr=self.learning_rate)
        done = False
        while not done:
            for batch in dataloader:
                optimizer.zero_grad()
                loss = self.get_loss(batch['x'], batch['label'])
                loss.backward()
                optimizer.step()
            if dataset.get_validation_accuracy() > .815:
                done = True



class Attention(Module):
    def __init__(self, layer_size, block_size):
        super().__init__()
        """
        All the layers you should use are defined here.

        """
        self.k_layer = Linear(layer_size, layer_size)
        self.q_layer = Linear(layer_size, layer_size)
        self.v_layer = Linear(layer_size,layer_size)

        #Masking part of attention layer
        self.register_buffer("mask", torch.tril(torch.ones(block_size, block_size))
                                     .view(1, 1, block_size, block_size))
       
        self.layer_size = layer_size


    def forward(self, input):
        """
        Applies the attention mechanism to input. All necessary layers have 
        been defined in __init__()
        
        """
        B, T, C = input.size()
     